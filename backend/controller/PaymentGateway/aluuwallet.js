import Transaction from "../../models/Transaction.js";
import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);
  return `${timestamp}${randomNum}`;
}

// Helper function to convert JSON to form-encoded format
function urlEncode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

const ALUU_BASE_URL = process.env.ALUU_BASE_URL || "https://pay.aluu.in";

/**
 * Aluu Pay Wallet Top-Up
 * Creates a wallet top-up order via Aluu Pay gateway
 */
export const aluuTopUp = async (req, res) => {
  try {
    const { value, userid } = req.body;

    if (!value || !userid) {
      return res.status(400).json({ error: "Value and userid are required" });
    }

    const number = parseFloat(value);
    if (isNaN(number) || number <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const uniqueId = generateUniqueId();
    const userInfo = await User.find({ userid: userid });

    if (!userInfo || userInfo.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userInfo[0];
    const wallet = await Wallet.findOne({ userid: userid });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    const userToken = process.env.ALUU_USER_TOKEN || "8806fd9ed341ab27b0d838fc538244ebe9ad4f151e202b7a3a16b727a738eaa1";
    const redirectUrl = `${process.env.REDIRECT_DOMAIN}/walletconfirmation?client_txn_id=${uniqueId}`;

    // Prepare form-encoded payload for Aluu Pay
    const payload = {
      customer_mobile: user.mobilenumber || "9999999999",
      user_token: userToken,
      amount: number.toFixed(2),
      order_id: uniqueId,
      redirect_url: redirectUrl,
      remark1: "Wallet Top-up",
      remark2: `User: ${user.email}`,
    };

    // Call Aluu Pay Create Order API
    const response = await fetch(`${ALUU_BASE_URL}/api/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncode(payload),
    });

    const data = await response.json();

    // Check if order creation failed
    if (!data.status) {
      console.error("Aluu Pay Wallet Top-up failed:", data);
      return res.status(400).json({
        error: data.message || "Failed to create wallet top-up order",
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      txnid: uniqueId,
      userid,
      useremail: user.email,
      amount: value,
      type: "Credit",
      walletid: wallet._id,
      status: "Created",
    });

    await transaction.save();

    res.status(200).json(data);
  } catch (err) {
    console.error("Error in aluuTopUp:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Aluu Pay Wallet Transaction Status
 * Checks the status of a wallet top-up transaction safely with atomic updates
 */
export const aluuTxnStatus = async (req, res) => {
  try {
    const { client_txn_id, date } = req.body;

    if (!client_txn_id) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    const existingTxn = await Transaction.findOne({ txnid: client_txn_id });
    if (!existingTxn) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const userToken = process.env.ALUU_USER_TOKEN || "8806fd9ed341ab27b0d838fc538244ebe9ad4f151e202b7a3a16b727a738eaa1";

    // Prepare form-encoded payload for Aluu Pay
    const payload = {
      user_token: userToken,
      order_id: client_txn_id,
    };

    // Call Aluu Pay Check Order Status API
    const response = await fetch(`${ALUU_BASE_URL}/api/check-order-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncode(payload),
    });

    const data = await response.json();

    const isPaymentSuccess =
      (data.status === true || data.status === "COMPLETED" || data.status === "SUCCESS") &&
      (data.result?.status === "SUCCESS" || data.result?.txnStatus === "SUCCESS" || data.result?.txnStatus === "COMPLETED");

    const isPaymentFailed =
      data.status === "ERROR" ||
      data.status === false ||
      data.result?.status === "FAILED" ||
      data.result?.status === "FAILURE" ||
      data.result?.txnStatus === "FAILED" ||
      data.result?.txnStatus === "FAILURE";

    // Process successful payment atomically to prevent race condition / double-credit
    if (isPaymentSuccess && existingTxn.status === "Created") {
      // Validate payment amount
      if (data.result?.amount && Math.abs(parseFloat(data.result.amount) - parseFloat(existingTxn.amount)) > 0.01) {
        console.error(`Amount mismatch for wallet txn ${client_txn_id}: expected ₹${existingTxn.amount}, received ₹${data.result.amount}`);
        await Transaction.findOneAndUpdate({ txnid: client_txn_id }, { status: "Fraud_Suspected" });
        return res.status(400).json({ error: "Payment amount mismatch detected" });
      }

      // Atomic status transition
      const lockedTxn = await Transaction.findOneAndUpdate(
        { txnid: client_txn_id, status: "Created" },
        { status: "Processing" },
        { new: true }
      );

      if (lockedTxn) {
        // Increment wallet balance atomically
        const updatedWallet = await Wallet.findByIdAndUpdate(
          lockedTxn.walletid,
          { $inc: { balance: parseInt(lockedTxn.amount) } },
          { new: true }
        );

        if (updatedWallet) {
          lockedTxn.status = "Success";
          await lockedTxn.save();
        }
      }
    } else if (isPaymentFailed && existingTxn.status === "Created") {
      await Transaction.findOneAndUpdate(
        { txnid: client_txn_id, status: "Created" },
        { status: "Failed" }
      );
    }

    // Fetch updated transaction record
    const updatedTransaction = await Transaction.findOne({ txnid: client_txn_id });

    const responseData = {
      ...data,
      txnid: client_txn_id,
      status: updatedTransaction ? updatedTransaction.status : "Pending",
      amount: updatedTransaction ? updatedTransaction.amount : existingTxn.amount,
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Error in aluuTxnStatus:", err);
    res.status(500).json({ error: err.message });
  }
};
