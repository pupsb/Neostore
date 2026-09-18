import { sendEmail } from "../../mailer.js";
import Items from "../../models/Items.js";
import Order from "../../models/Orders.js";
import Products from "../../models/Products.js";
import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import Transaction from "../../models/Transaction.js";
import Point from "../../models/Points.js";
import processSmileOneOrder from "../ProcessApiOrder/processSmileApiOrders.js";
import processMoogoldApiOrder from "../ProcessApiOrder/processMoogoldApiOrders.js";
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

const ALUU_BASE_URL = process.env.ALUU_BASE_URL || "https://pay.aluu.in";

/**
 * Create Order API - Aluu Pay
 * Creates a new payment order with Aluu Pay gateway (pay.aluu.in)
 */
export const createAluuOrder = async (req, res) => {
  try {
    const { userid, input1, input2, paymentmode, itemid, product_id } = req.body;

    // Fetch item and product details
    const item = await Items.findOne({ itemid: itemid });
    const product = await Products.findById(product_id);

    if (!item || !product) {
      return res.status(404).json({ error: "Item or Product not found" });
    }

    const productid = product.productid;
    const dbproductid = product_id;
    const itemname = item.name;
    const status = "Created";

    // Fetch user information
    const userInformation = await User.findById(userid);
    if (!userInformation) {
      return res.status(404).json({ error: "User not found" });
    }

    // Determine the price based on user role
    let value;
    if (userInformation.role === "reseller") {
      value = item.resellprice;
    } else {
      value = item.discountedprice;
    }

    const number = parseFloat(value);
    if (isNaN(number) || number <= 0) {
      return res.status(400).json({ error: "Invalid price calculation" });
    }

    const uniqueId = generateUniqueId();
    const itemidarray = item.itemidarray;

    // Prepare form-encoded payload for Aluu Pay
    const userToken = process.env.ALUU_USER_TOKEN || "8806fd9ed341ab27b0d838fc538244ebe9ad4f151e202b7a3a16b727a738eaa1";
    const redirectUrl = `${process.env.REDIRECT_DOMAIN}/confirmation?client_txn_id=${uniqueId}`;

    const payload = {
      customer_mobile: userInformation.mobilenumber || "9999999999",
      user_token: userToken,
      amount: number.toFixed(2),
      order_id: uniqueId,
      redirect_url: redirectUrl,
      remark1: `${product.name} - ${itemname}`,
      remark2: `User: ${userInformation.email}`,
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
      console.error("Aluu Pay Create Order failed:", data);
      return res.status(400).json({
        error: data.message || "Failed to create order with payment gateway",
      });
    }

    // Create order record in database
    const newOrder = new Order({
      orderid: uniqueId,
      itemname,
      productid,
      dbproductid,
      useremail: userInformation.email,
      productname: product.name,
      itemid,
      status,
      userid,
      input1,
      input2,
      paymentmode,
      value,
      transactionid: uniqueId,
      itemidarray,
    });

    const savedOrder = await newOrder.save();

    const newData = {
      ...data,
      order: savedOrder,
    };

    res.status(200).json(newData);
  } catch (err) {
    console.error("Error in createAluuOrder:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Check Order Status API - Aluu Pay
 * Verifies the status of an order and processes fulfillment safely
 */
export const checkAluuOrderStatus = async (req, res) => {
  try {
    const { order_id, date } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    // Find order in database
    const existingOrder = await Order.findOne({ transactionid: order_id });
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Prepare form-encoded payload for Aluu Pay
    const userToken = process.env.ALUU_USER_TOKEN || "8806fd9ed341ab27b0d838fc538244ebe9ad4f151e202b7a3a16b727a738eaa1";
    const payload = {
      user_token: userToken,
      order_id: order_id,
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

    // Check payment success conditions
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

    // Atomically transition from Created to Queued to prevent race conditions / duplicate processing
    if (
      (isPaymentSuccess && existingOrder.status === "Created") ||
      (existingOrder.paymentmode === "wallet" && existingOrder.status === "Created")
    ) {
      // Validate payment amount to prevent underpayment/tampering
      if (data.result?.amount && Math.abs(parseFloat(data.result.amount) - parseFloat(existingOrder.value)) > 0.01) {
        console.error(`Amount mismatch for order ${order_id}: expected ₹${existingOrder.value}, received ₹${data.result.amount}`);
        await Order.findOneAndUpdate({ transactionid: order_id }, { status: "Fraud_Suspected" });
        return res.status(400).json({ error: "Payment amount mismatch detected" });
      }

      // Atomic lock: Only one concurrent call will succeed in changing status from Created to Queued
      const lockedOrder = await Order.findOneAndUpdate(
        { transactionid: order_id, status: "Created" },
        { status: "Queued", date },
        { new: true }
      );

      if (lockedOrder) {
        await fulfillOrder(lockedOrder, date, data.result?.utr || "");
      }
    } else if (isPaymentFailed && existingOrder.status === "Created") {
      await Order.findOneAndUpdate(
        { transactionid: order_id, status: "Created" },
        { status: "Failed" }
      );
    }

    // Get latest order state
    const updatedOrder = await Order.findOne({ transactionid: order_id });

    const responsePayload = {
      ...data,
      order: updatedOrder,
    };

    res.status(200).json(responsePayload);
  } catch (err) {
    console.error("Error in checkAluuOrderStatus:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Webhook Handler - Aluu Pay
 * Receives and processes payment webhooks with HMAC-SHA256 signature verification
 * Also acts as a unified webhook supporting wallet top-up transactions seamlessly
 */
export const aluuWebhook = async (req, res) => {
  try {
    // Extract headers
    const timestamp = req.get("x-webhook-timestamp") || req.get("x-expay-timestamp") || "";
    const signature = req.get("x-webhook-signature") || req.get("x-expay-signature") || "";
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const webhookSecret = process.env.ALUU_WEBHOOK_SECRET;

    // Security Verification if webhook secret is configured
    if (webhookSecret && webhookSecret.trim().length > 0) {
      // 1. Check timestamp freshness to mitigate replay attacks (10 minutes window)
      if (timestamp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const reqTime = parseInt(timestamp, 10);
        if (!isNaN(reqTime)) {
          const parsedTime = reqTime > 1e11 ? Math.floor(reqTime / 1000) : reqTime;
          if (Math.abs(currentTime - parsedTime) > 600) {
            console.error("Aluu Webhook rejected: Timestamp expired");
            return res.status(401).json({ error: "Webhook timestamp expired" });
          }
        }
      }

      // 2. Compute expected HMAC SHA256
      const hmac = crypto
        .createHmac("sha256", webhookSecret)
        .update(`${timestamp}.${rawBody}`)
        .digest("hex");

      const expectedFull = `sha256=${hmac}`;

      // 3. Timing-safe comparison to prevent timing attacks
      let signatureValid = false;
      if (signature) {
        const sigToCompare = signature.startsWith("sha256=") ? signature : `sha256=${signature}`;
        const sigBuf = Buffer.from(sigToCompare);
        const expBuf = Buffer.from(expectedFull);

        if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
          signatureValid = true;
        }
      }

      if (!signatureValid) {
        console.error("Aluu Webhook: Invalid signature received");
        return res.status(401).json({ error: "Invalid signature" });
      }
    } else {
      console.warn("ALUU_WEBHOOK_SECRET is not configured. Webhook signature check skipped.");
    }

    // Extract payload data
    const orderId = req.body.orderId || req.body.order_id || req.body.client_txn_id;
    const status = req.body.status || req.body.txnStatus;
    const amount = req.body.amount;
    const utr = req.body.utr || "";
    const date = req.body.date || new Date().toISOString();

    // Respond 200 OK immediately as required by webhook standards
    res.status(200).json({ ok: true });

    // Process asynchronously without blocking gateway response
    processAluuWebhookAsync(orderId, status, amount, utr, date)
      .catch((err) => console.error("Error processing Aluu webhook:", err));

  } catch (err) {
    console.error("Aluu Webhook error:", err);
    res.status(200).json({ ok: false });
  }
};

/**
 * Async Webhook Processor
 * Handles game recharge orders and wallet top-ups idempotently
 */
async function processAluuWebhookAsync(orderId, status, amount, utr, date) {
  try {
    if (!orderId) {
      console.error("Aluu Webhook: Missing order ID");
      return;
    }

    const isSuccess =
      status === "SUCCESS" ||
      status === "COMPLETED" ||
      status === true;

    if (!isSuccess) {
      console.log(`Skipping non-success webhook event: ${status} for ${orderId}`);
      return;
    }

    // 1. Check if orderId belongs to a Store Order
    const order = await Order.findOne({ transactionid: orderId });
    if (order) {
      // Validate payment amount
      if (amount && Math.abs(parseFloat(amount) - parseFloat(order.value)) > 0.01) {
        console.error(`Amount mismatch in webhook for order ${orderId}: expected ${order.value}, received ${amount}`);
        await Order.findOneAndUpdate({ transactionid: orderId }, { status: "Fraud_Suspected" });
        return;
      }

      // Atomic lock
      const lockedOrder = await Order.findOneAndUpdate(
        { transactionid: orderId, status: "Created" },
        { status: "Queued", date },
        { new: true }
      );

      if (!lockedOrder) {
        console.log(`Order ${orderId} already processed, current status: ${order.status}`);
        return;
      }

      await fulfillOrder(lockedOrder, date, utr);
      return;
    }

    // 2. Check if orderId belongs to a Wallet Top-up Transaction
    const txn = await Transaction.findOne({ txnid: orderId });
    if (txn) {
      // Validate payment amount
      if (amount && Math.abs(parseFloat(amount) - parseFloat(txn.amount)) > 0.01) {
        console.error(`Amount mismatch in webhook for wallet top-up ${orderId}: expected ${txn.amount}, received ${amount}`);
        await Transaction.findOneAndUpdate({ txnid: orderId }, { status: "Fraud_Suspected" });
        return;
      }

      // Atomic lock
      const lockedTxn = await Transaction.findOneAndUpdate(
        { txnid: orderId, status: "Created" },
        { status: "Processing" },
        { new: true }
      );

      if (!lockedTxn) {
        console.log(`Wallet top-up transaction ${orderId} already processed, current status: ${txn.status}`);
        return;
      }

      // Atomically credit wallet balance
      const updatedWallet = await Wallet.findByIdAndUpdate(
        lockedTxn.walletid,
        { $inc: { balance: parseInt(lockedTxn.amount) } },
        { new: true }
      );

      if (updatedWallet) {
        lockedTxn.status = "Success";
        await lockedTxn.save();
        console.log(`Wallet top-up successful for txn ${orderId}. New balance: ${updatedWallet.balance}`);
      }
      return;
    }

    console.warn(`Aluu Webhook: No order or transaction record found for ID ${orderId}`);
  } catch (err) {
    console.error("Error in async Aluu webhook processing:", err);
  }
}

/**
 * Order Fulfillment Helper
 * Handles SmileOne API, Moogold API, or manual fulfillment cleanly
 */
async function fulfillOrder(order, date, utr) {
  const product = await Products.findOne({ productid: order.productid });
  const item = await Items.findOne({ itemid: order.itemid });
  const points = await Point.findOne({ dbuserid: order.userid });

  if (!product || !item) {
    console.error(`Missing product/item data for order ${order.orderid}`);
    return;
  }

  const orderId = order.orderid;
  const itemidarray = order.itemidarray;

  // Process SmileOne API orders
  if (
    product.isApi &&
    item.isApi &&
    (item.apiType === "SMILEBR" || item.apiType === "SMILEPH")
  ) {
    const completeSmileOneOrder = await processSmileOneOrder(
      orderId,
      itemidarray,
      product,
      item,
      order,
      date
    );

    if (completeSmileOneOrder) {
      await Order.findOneAndUpdate(
        { transactionid: orderId },
        { status: "Completed", date, product_name: product.name }
      );

      if (points) {
        let newBalance = points.balance + order.value / process.env.POINTS_RATIO;
        const transaction = { type: "credit", amount: order.value };
        await Point.findOneAndUpdate(
          { dbuserid: order.userid },
          { balance: newBalance, $push: { transactions: transaction } },
          { new: true }
        );
      }

      sendEmail(
        order.useremail,
        `Your order ${orderId} has been completed successfully`,
        `Order Number : ${orderId}\n\nOrder Date : ${date}\n\nProduct Name : ${product.name}\n\nItem : ${order.itemname}\n\nUserId : ${order.input1}\n\nServerId : ${order.input2}\n\nPrice : ₹${order.value}\n\nUTR : ${utr}\n\nThank you for purchasing from NeoStore\n\nIf you have any issues related to the order, kindly contact customer service via Live Chat.\n\nBest Regards,\nNeoStore`
      );
    } else {
      await Order.findOneAndUpdate(
        { transactionid: orderId },
        { status: "Processing", date, product_name: product.name }
      );

      sendEmail(
        process.env.EMAIL,
        `NeoStore - New Order Received!`,
        `Order Number : ${orderId}\n\nOrder Date : ${date}\n\nProduct Name : ${product.name}\n\nItem : ${order.itemname}\n\nUserId : ${order.input1}\n\nServerId : ${order.input2}\n\nPrice : ₹${order.value}\n\n`
      );
    }
  }
  // Process Moogold API orders
  else if (
    product.isApi &&
    item.isApi &&
    (item.apiType === "MOOGOLDMLBB" ||
      item.apiType === "MOOGOLDGENSHIN" ||
      item.apiType === "MOOGOLDPUBG" ||
      item.apiType === "MOOGOLDHOK")
  ) {
    const completeMoogoldOrder = await processMoogoldApiOrder(
      orderId,
      itemidarray,
      item,
      product,
      order,
      date
    );

    if (completeMoogoldOrder) {
      await Order.findOneAndUpdate(
        { transactionid: orderId },
        { status: "Completed", date, product_name: product.name }
      );

      if (points) {
        let newBalance = points.balance + order.value / process.env.POINTS_RATIO;
        const transaction = { type: "credit", amount: order.value };
        await Point.findOneAndUpdate(
          { dbuserid: order.userid },
          { balance: newBalance, $push: { transactions: transaction } },
          { new: true }
        );
      }

      sendEmail(
        order.useremail,
        `Your order ${orderId} has been completed successfully`,
        `Order Number : ${orderId}\n\nOrder Date : ${date}\n\nProduct Name : ${product.name}\n\nItem : ${order.itemname}\n\nUserId : ${order.input1}\n\nServerId : ${order.input2}\n\nPrice : ₹${order.value}\n\nUTR : ${utr}\n\nThank you for purchasing from NeoStore\n\nIf you have any issues related to the order, kindly contact customer service via Live Chat.\n\nBest Regards,\nNeoStore`
      );
    } else {
      await Order.findOneAndUpdate(
        { transactionid: orderId },
        { status: "Processing", date, product_name: product.name }
      );

      sendEmail(
        process.env.EMAIL,
        `NeoStore - New Order Received!`,
        `Order Number : ${orderId}\n\nOrder Date : ${date}\n\nProduct Name : ${product.name}\n\nItem : ${order.itemname}\n\nUserId : ${order.input1}\n\nServerId : ${order.input2}\n\nPrice : ₹${order.value}\n\n`
      );
    }
  }
  // Process manual orders
  else {
    await Order.findOneAndUpdate(
      { transactionid: orderId },
      { status: "Processing", date, product_name: product.name }
    );

    sendEmail(
      process.env.EMAIL,
      `NeoStore - New Order Received!`,
      `Order Number : ${orderId}\n\nOrder Date : ${date}\n\nProduct Name : ${product.name}\n\nItem : ${order.itemname}\n\nUserId : ${order.input1}\n\nServerId : ${order.input2}\n\nPrice : ₹${order.value}\n\n`
    );
  }

  console.log(`Order ${orderId} fulfillment process completed.`);
}
