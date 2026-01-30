import { sendEmail } from "../../mailer.js";
import Items from "../../models/Items.js";
import Order from "../../models/Orders.js";
import Products from "../../models/Products.js";
import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import UpiTransaction from "../../models/UpiTransactions.js";
import Transaction from "../../models/Transaction.js";
import Point from "../../models/Points.js";
import processSmileOneOrder from "../ProcessApiOrder/processSmileApiOrders.js";
import processMoogoldApiOrder from "../ProcessApiOrder/processMoogoldApiOrders.js";
import crypto from "crypto";

function generateUniqueId() {
  const timestamp = Date.now(); // Get the current timestamp
  const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
  return `${timestamp}${randomNum}`; // Combine them to form the unique ID
}

// Helper function to convert JSON to form-encoded format
function urlEncode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

/**
 * Create Order API - ExPay3
 * Creates a new payment order with ExPay3 gateway
 */
export const createExpayOrder = async (req, res) => {
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
    const uniqueId = generateUniqueId();
    const itemidarray = item.itemidarray;

    // Prepare form-encoded payload for ExPay3
    const payload = {
      customer_mobile: userInformation.mobilenumber,
      user_token: process.env.EXPAY_USER_TOKEN,
      amount: number.toFixed(2),
      order_id: uniqueId,
      redirect_url: `${process.env.REDIRECT_DOMAIN}/confirmation?client_txn_id=${uniqueId}`,
      remark1: `${product.name} - ${itemname}`,
      remark2: `User: ${userInformation.email}`,
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
        error: data.message || "Failed to create order" 
      });
    }

    // Create order in database
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
    res.status(500).json({ error: err.message });
  }
};

/**
 * Check Order Status API - ExPay3
 * Checks the status of an order and processes it accordingly
 */
export const checkExpayOrderStatus = async (req, res) => {
  try {
    const { order_id, date } = req.body;

    // Prepare form-encoded payload for ExPay3
    const payload = {
      user_token: process.env.EXPAY_USER_TOKEN,
      order_id: order_id,
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

    // Find order in database
    let order = await Order.findOne({ transactionid: order_id });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const product = await Products.findOne({ productid: order.productid });
    const item = await Items.findOne({ itemid: order.itemid });
    const itemidarray = order.itemidarray;
    const points = await Point.findOne({ dbuserid: order.userid });

    // Process order if payment successful and order not already processed
    if (
      (data.status && data.result?.txnStatus === "SUCCESS" && order.status === "Created") ||
      (order.paymentmode === "wallet" && order.status === "Created")
    ) {
      // Update order to Queued status
      order = await Order.findOneAndUpdate(
        { orderid: order_id },
        { status: "Queued" },
        { new: true }
      );

      // Process SmileOne API orders
      
      // DEBUG: Check ExPay Order Status logic
      console.log('[EXPAY_STATUS] Item Check:', {
        name: item.name,
        apiType: item.apiType,
        isApi: item.isApi,
        orderStatus: order.status
      });

      if (product.isApi && item.isApi && 
          (item.apiType === "SMILEBR" || item.apiType === "SMILEPH") && 
          order.status === "Queued") {
        
        const completeSmileOneOrder = await processSmileOneOrder(
          order_id, itemidarray, item, product, order, date
        );

        // If SmileOne recharge successful
        if (completeSmileOneOrder) {
          await Order.findOneAndUpdate(
            { transactionid: order_id },
            { status: "Completed", date, product_name: product.name }
          );

          // Update points
          let newBalance = points.balance + order.value / process.env.POINTS_RATIO;
          const transaction = {
            type: "credit",
            amount: order.value,
          };

          await Point.findOneAndUpdate(
            { dbuserid: order.userid },
            { balance: newBalance, $push: { transactions: transaction } },
            { new: true }
          );

          // Send completion email
          sendEmail(
            order.useremail,
            `Your order ${order_id} has been completed successfully`,
            `Order Number : ${order_id}\n\n
            Order Date : ${date}\n\n
            Product Name : ${product.name}\n\n
            Item : ${order.itemname}\n\n
            UserId : ${order.input1}\n\n
            ServerId : ${order.input2}\n\n
            Price : ₹${order.value}\n\n
            Thank you for purchasing from Woex Supply\n\n
            If you have any issues related to the order, kindly contact customer service via Live Chat.
            Best Regards,\n\n
            Woex Supply`
          );
        } else {
          // SmileOne recharge failed
          await Order.findOneAndUpdate(
            { transactionid: order_id },
            { status: "Processing", date, product_name: product.name }
          );

          sendEmail(
            process.env.EMAIL,
            `Gray - New Order Received!`,
            `Order Number : ${order_id}\n\n
            Order Date : ${date}\n\n
            Product Name : ${product.name}\n\n
            Item : ${order.itemname}\n\n
            UserId : ${order.input1}\n\n
            ServerId : ${order.input2}\n\n
            Price : ₹${order.value}\n\n`
          );
        }
      }
      // Process Moogold API orders
      else if (product.isApi && item.isApi && 
               (item.apiType === "MOOGOLDMLBB" || item.apiType === "MOOGOLDGENSHIN" || 
                item.apiType === "MOOGOLDPUBG" || item.apiType === "MOOGOLDHOK") && 
               order.status === "Queued") {
        
        const completeMoogoldOrder = await processMoogoldApiOrder(
          order_id, itemidarray, item, product, order, date
        );

        // If Moogold recharge successful
        if (completeMoogoldOrder) {
          await Order.findOneAndUpdate(
            { transactionid: order_id },
            { status: "Completed", date, product_name: product.name }
          );

          // Update points
          let newBalance = points.balance + order.value / process.env.POINTS_RATIO;
          const transaction = {
            type: "credit",
            amount: order.value,
          };

          await Point.findOneAndUpdate(
            { dbuserid: order.userid },
            { balance: newBalance, $push: { transactions: transaction } },
            { new: true }
          );

          // Send completion email
          sendEmail(
            order.useremail,
            `Your order ${order_id} has been completed successfully`,
            `Order Number : ${order_id}\n\n
            Order Date : ${date}\n\n
            Product Name : ${product.name}\n\n
            Item : ${order.itemname}\n\n
            UserId : ${order.input1}\n\n
            ServerId : ${order.input2}\n\n
            Price : ₹${order.value}\n\n
            Thank you for purchasing from Woex Supply\n\n
            If you have any issues related to the order, kindly contact customer service via Live Chat.
            Best Regards,\n\n
            Woex Supply`
          );
        } else {
          // Moogold recharge failed
          await Order.findOneAndUpdate(
            { transactionid: order_id },
            { status: "Processing", date, product_name: product.name }
          );
          
          sendEmail(
            process.env.EMAIL,
            `Gray - New Order Received!`,
            `Order Number : ${order_id}\n\n
            Order Date : ${date}\n\n
            Product Name : ${product.name}\n\n
            Item : ${order.itemname}\n\n
            UserId : ${order.input1}\n\n
            ServerId : ${order.input2}\n\n
            Price : ₹${order.value}\n\n`
          );
        }
      }
      // Process manual orders
      else {
        await Order.findOneAndUpdate(
          { transactionid: order_id },
          { status: "Processing", date, product_name: product.name }
        );

        sendEmail(
          process.env.EMAIL,
          `Gray - New Order Received!`,
          `Order Number : ${order_id}\n\n
          Order Date : ${date}\n\n
          Product Name : ${product.name}\n\n
          Item : ${order.itemname}\n\n
          UserId : ${order.input1}\n\n
          ServerId : ${order.input2}\n\n
          Price : ₹${order.value}\n\n`
        );
      }
    }
    // Handle failed payments
    else if (data.status && data.result?.txnStatus === "FAILURE") {
      await Order.findOneAndUpdate(
        { transactionid: order_id },
        { status: "Failed" }
      );
    }

    // Get updated order
    const updatedOrder = await Order.findOne({ transactionid: order_id });

    const newData = {
      ...data,
      order: updatedOrder,
    };

    res.status(200).json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Webhook Handler - ExPay3
 * Receives and processes payment webhooks with signature verification
 */
export const expayWebhook = async (req, res) => {
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
      console.error("Invalid webhook signature");
      return res.status(400).json({ ok: false, error: "Invalid signature" });
    }

    // Extract webhook payload
    const { orderId, status, amount, utr, date, remark1, remark2 } = req.body;

    // Return 200 immediately as required by ExPay3
    res.status(200).json({ ok: true });

    // Process webhook asynchronously (don't await)
    processWebhookAsync(orderId, status, amount, utr, date, event, remark1, remark2)
      .catch(err => {
        console.error("Error processing webhook:", err);
      });

  } catch (err) {
    console.error("Webhook error:", err);
    // Still return 200 to prevent retries for malformed requests
    res.status(200).json({ ok: false });
  }
};

/**
 * Async webhook processor
 * Processes the webhook data without blocking the response
 */
async function processWebhookAsync(orderId, status, amount, utr, date, event, remark1, remark2) {
  try {
    // Only process SUCCESS events
    if (event !== "PAYMENT_SUCCESS" || status !== "SUCCESS") {
      console.log(`Skipping webhook processing for event: ${event}, status: ${status}`);
      return;
    }

    // Find the order
    const order = await Order.findOne({ transactionid: orderId });
    
    if (!order) {
      console.error(`Order not found for webhook: ${orderId}`);
      return;
    }

    // Only process if order is still in Created status
    if (order.status !== "Created") {
      console.log(`Order ${orderId} already processed, current status: ${order.status}`);
      return;
    }

    // Update order to Queued and let the checkExpayOrderStatus handle the rest
    await Order.findOneAndUpdate(
      { transactionid: orderId },
      { status: "Queued", date }
    );

    // Fetch required data for processing
    const product = await Products.findOne({ productid: order.productid });
    const item = await Items.findOne({ itemid: order.itemid });
    const points = await Point.findOne({ dbuserid: order.userid });

    if (!product || !item || !points) {
      console.error(`Missing data for order ${orderId}`);
      return;
    }

    const itemidarray = order.itemidarray;

    // Process based on product type (same logic as checkExpayOrderStatus)
    if (product.isApi && item.isApi && 
        (item.apiType === "SMILEBR" || item.apiType === "SMILEPH")) {
      
      const completeSmileOneOrder = await processSmileOneOrder(
        orderId, itemidarray, item, product, order, date
      );

      if (completeSmileOneOrder) {
        await Order.findOneAndUpdate(
          { transactionid: orderId },
          { status: "Completed", date, product_name: product.name }
        );

        let newBalance = points.balance + order.value / process.env.POINTS_RATIO;
        const transaction = {
          type: "credit",
          amount: order.value,
        };

        await Point.findOneAndUpdate(
          { dbuserid: order.userid },
          { balance: newBalance, $push: { transactions: transaction } },
          { new: true }
        );

        sendEmail(
          order.useremail,
          `Your order ${orderId} has been completed successfully`,
          `Order Number : ${orderId}\n\n
          Order Date : ${date}\n\n
          Product Name : ${product.name}\n\n
          Item : ${order.itemname}\n\n
          UserId : ${order.input1}\n\n
          ServerId : ${order.input2}\n\n
          Price : ₹${order.value}\n\n
          UTR : ${utr}\n\n
          Thank you for purchasing from Woex Supply\n\n
          If you have any issues related to the order, kindly contact customer service via Live Chat.
          Best Regards,\n\n
          Woex Supply`
        );
      } else {
        await Order.findOneAndUpdate(
          { transactionid: orderId },
          { status: "Processing", date, product_name: product.name }
        );

        sendEmail(
          process.env.EMAIL,
          `Gray - New Order Received!`,
          `Order Number : ${orderId}\n\n
          Order Date : ${date}\n\n
          Product Name : ${product.name}\n\n
          Item : ${order.itemname}\n\n
          UserId : ${order.input1}\n\n
          ServerId : ${order.input2}\n\n
          Price : ₹${order.value}\n\n`
        );
      }
    }
    else if (product.isApi && item.isApi && 
             (item.apiType === "MOOGOLDMLBB" || item.apiType === "MOOGOLDGENSHIN" || 
              item.apiType === "MOOGOLDPUBG" || item.apiType === "MOOGOLDHOK")) {
      
      const completeMoogoldOrder = await processMoogoldApiOrder(
        orderId, itemidarray, item, product, order, date
      );

      if (completeMoogoldOrder) {
        await Order.findOneAndUpdate(
          { transactionid: orderId },
          { status: "Completed", date, product_name: product.name }
        );

        let newBalance = points.balance + order.value / process.env.POINTS_RATIO;
        const transaction = {
          type: "credit",
          amount: order.value,
        };

        await Point.findOneAndUpdate(
          { dbuserid: order.userid },
          { balance: newBalance, $push: { transactions: transaction } },
          { new: true }
        );

        sendEmail(
          order.useremail,
          `Your order ${orderId} has been completed successfully`,
          `Order Number : ${orderId}\n\n
          Order Date : ${date}\n\n
          Product Name : ${product.name}\n\n
          Item : ${order.itemname}\n\n
          UserId : ${order.input1}\n\n
          ServerId : ${order.input2}\n\n
          Price : ₹${order.value}\n\n
          UTR : ${utr}\n\n
          Thank you for purchasing from Woex Supply\n\n
          If you have any issues related to the order, kindly contact customer service via Live Chat.
          Best Regards,\n\n
          Woex Supply`
        );
      } else {
        await Order.findOneAndUpdate(
          { transactionid: orderId },
          { status: "Processing", date, product_name: product.name }
        );
        
        sendEmail(
          process.env.EMAIL,
          `Gray - New Order Received!`,
          `Order Number : ${orderId}\n\n
          Order Date : ${date}\n\n
          Product Name : ${product.name}\n\n
          Item : ${order.itemname}\n\n
          UserId : ${order.input1}\n\n
          ServerId : ${order.input2}\n\n
          Price : ₹${order.value}\n\n`
        );
      }
    }
    else {
      await Order.findOneAndUpdate(
        { transactionid: orderId },
        { status: "Processing", date, product_name: product.name }
      );

      sendEmail(
        process.env.EMAIL,
        `Gray - New Order Received!`,
        `Order Number : ${orderId}\n\n
        Order Date : ${date}\n\n
        Product Name : ${product.name}\n\n
        Item : ${order.itemname}\n\n
        UserId : ${order.input1}\n\n
        ServerId : ${order.input2}\n\n
        Price : ₹${order.value}\n\n`
      );
    }

    console.log(`Webhook processed successfully for order: ${orderId}`);
  } catch (err) {
    console.error("Error in async webhook processing:", err);
  }
}
