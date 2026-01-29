import Transaction from "../../models/Transaction.js";
import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import crypto from "crypto";

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

/**
 * ExPay3 Wallet Top-Up
 * Creates a wallet top-up order via ExPay3 gateway
 */
export const expayTopUp = async (req, res) => {
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

    // Prepare form-encoded payload for ExPay3
    const payload = {
      customer_mobile: user.mobilenumber,
      user_token: process.env.EXPAY_USER_TOKEN,
      amount: number.toFixed(2),
      order_id: uniqueId,
      redirect_url: `${process.env.REDIRECT_DOMAIN}/walletconfirmation?client_txn_id=${uniqueId}`,
      remark1: "Wallet Top-up",
      remark2: `User: ${user.email}`,
    };

    // Call ExPay3 Create Order API
    const response = await fetch(`https://expay3.in/api/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncode(payload),
    });

    const data = await response.json();

    // Check if order creation failed
    if (!data.status) {
      return res.status(400).json({ 
        error: data.message || "Failed to create wallet top-up order" 
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
    });

    await transaction.save();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * ExPay3 Transaction Status
 * Checks the status of a wallet top-up transaction
 */
export const expayTxnStatus = async (req, res) => {
  try {
    const { client_txn_id, date } = req.body;

    if (!client_txn_id) {
      return res.status(400).json({ error: "Transaction ID is required" });
    }

    // Prepare form-encoded payload for ExPay3
    const payload = {
      user_token: process.env.EXPAY_USER_TOKEN,
      order_id: client_txn_id,
    };

    // Call ExPay3 Check Order Status API
    const response = await fetch(`https://expay3.in/api/check-order-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncode(payload),
    });

    const data = await response.json();

    // Find transaction in database
    const txn = await Transaction.findOne({ txnid: client_txn_id });
    
    if (!txn) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Process successful payment
    if (data.status && data.result?.txnStatus === "SUCCESS" && txn.status === "Created") {
      const wallet = await Wallet.findOne({ _id: txn.walletid });
      
      if (wallet) {
        // Update wallet balance
        wallet.balance = wallet.balance + parseInt(txn.amount);
        await wallet.save();

        // Update transaction status
        txn.status = "Success";
        await txn.save();
      }
    }
    // Handle failed payment
    else if (data.status && data.result?.txnStatus === "FAILURE") {
      txn.status = "Failed";
      await txn.save();
    }

    // Get updated transaction
    const updatedTransaction = await Transaction.findOne({ txnid: client_txn_id });

    const responseData = {
      ...data,
      txnid: client_txn_id,
      status: updatedTransaction.status,
      amount: updatedTransaction.amount,
    };

    console.log("=== Sending Wallet Transaction Status Response ===");
    console.log("Response data:", responseData);

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Error in expayTxnStatus:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ExPay3 Wallet Webhook Handler
 * Processes wallet top-up webhooks from ExPay3
 */
export const expayWalletWebhook = async (req, res) => {
  try {
    // Extract headers
    const timestamp = req.get("x-expay-timestamp") || "";
    const signature = req.get("x-expay-signature") || "";
    const event = req.get("x-expay-event") || "";

    // Get raw body for signature verification
    const rawBody = req.rawBody || JSON.stringify(req.body);

    // Verify signature
    const expectedHmac = crypto
      .createHmac("sha256", process.env.EXPAY_WEBHOOK_SECRET)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    // Check if signature matches
    if (!signature.includes(`v1=${expectedHmac}`)) {
      console.error("Invalid wallet webhook signature");
      return res.status(400).json({ ok: false, error: "Invalid signature" });
    }

    // Extract webhook payload
    const { orderId, status, amount, utr, date } = req.body;

    // Return 200 immediately as required by ExPay3
    res.status(200).json({ ok: true });

    // Process webhook asynchronously (don't await)
    processWalletWebhookAsync(orderId, status, amount, utr, date, event)
      .catch(err => {
        console.error("Error processing wallet webhook:", err);
      });

  } catch (err) {
    console.error("Wallet webhook error:", err);
    // Still return 200 to prevent retries for malformed requests
    res.status(200).json({ ok: false });
  }
};

/**
 * Async wallet webhook processor
 * Processes the webhook data without blocking the response
 */
async function processWalletWebhookAsync(orderId, status, amount, utr, date, event) {
  try {
    // Only process SUCCESS events
    if (event !== "PAYMENT_SUCCESS" || status !== "SUCCESS") {
      console.log(`Skipping wallet webhook processing for event: ${event}, status: ${status}`);
      return;
    }

    // Find the transaction
    const txn = await Transaction.findOne({ txnid: orderId });
    
    if (!txn) {
      console.error(`Transaction not found for wallet webhook: ${orderId}`);
      return;
    }

    // Only process if transaction is still in Created status
    if (txn.status !== "Created") {
      console.log(`Transaction ${orderId} already processed, current status: ${txn.status}`);
      return;
    }

    // Find and update wallet
    const wallet = await Wallet.findOne({ _id: txn.walletid });
    
    if (!wallet) {
      console.error(`Wallet not found for transaction ${orderId}`);
      return;
    }

    // Update wallet balance
    wallet.balance = wallet.balance + parseInt(txn.amount);
    await wallet.save();

    // Update transaction status
    txn.status = "Success";
    await txn.save();

    console.log(`Wallet webhook processed successfully for transaction: ${orderId}, amount: ${amount}`);
  } catch (err) {
    console.error("Error in async wallet webhook processing:", err);
  }
}
