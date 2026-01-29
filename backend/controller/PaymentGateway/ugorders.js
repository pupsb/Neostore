import { sendEmail } from "../../mailer.js";
import Items from "../../models/Items.js";
import Order from "../../models/Orders.js";
import Products from "../../models/Products.js";
import User from "../../models/User.js";
import CryptoJS from "crypto-js";
import Wallet from "../../models/Wallet.js";
import UpiTransaction from "../../models/UpiTransactions.js";
import Transaction from "../../models/Transaction.js";
import Point from "../../models/Points.js";
import processSmileOneOrder from "../ProcessApiOrder/processSmileApiOrders.js";
import processMoogoldApiOrder from "../ProcessApiOrder/processMoogoldApiOrders.js";

function generateUniqueId() {
  const timestamp = Date.now(); // Get the current timestamp
  const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
  return `${timestamp}-${randomNum}`; // Combine them to form the unique ID
}

export const upiGateway = async (req, res) => {
  try {
    const { userid, input1, input2, paymentmode, itemid, product_id } = req.body;
    const item = await Items.findOne({ itemid: itemid });
    const product = await Products.findById(product_id);
    const productid = product.productid;
    const dbproductid = product_id;
    const itemname = item.name;
    const status = "Created";

    // Fetch user information
    const userInformation = await User.findById(userid);
    // console.log(userInformation);
    if (!userInformation) {
      return res.status(404).json({ error: "User not found" });
    }
    // Determine the price based on user role
    let value;
    if (userInformation.role === "reseller") {
      // console.log(userInformation.role);
      value = item.resellprice;
      // console.log(value);
    } else {
      // console.log(userInformation.role);
      value = item.discountedprice;
      // console.log(value);
    }

    // console.log(item)
    // const value = item.discountedprice;
    // const value = item.resellprice;
    // console.log(value);
    const number = parseFloat(value);
    const uniqueId = generateUniqueId();
    const userInfo = await User.find({ _id: userid });
    const user = userInfo[0];
    const itemidarray = item.itemidarray;

    // console.log(item.discountedprice)

    const response = await fetch(`https://api.ekqr.in/api/create_order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.API_KEY,
        client_txn_id: uniqueId,
        amount: number.toFixed(2),
        p_info: "test",
        customer_name: user.name,
        customer_email: user.email,
        customer_mobile: user.mobilenumber,
        // redirect_url: "https://senofficial.in/confirmation",
        redirect_url: `${process.env.REDIRECT_DOMAIN}/confirmation`,
      }),
    });

    const data = await response.json();

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

export const ugOrderStatus = async (req, res) => {
  try {
    const { client_txn_id, date } = req.body;

    const response = await fetch(`https://api.ekqr.in/api/check_order_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: process.env.API_KEY,
        client_txn_id: client_txn_id,
        txn_date: date,
      }),
    });

    const data = await response.json();
    // console.log(data);

    let order;
    order = await Order.findOne({ transactionid: client_txn_id });
    const product = await Products.findOne({ productid: order.productid });
    const item = await Items.findOne({ itemid: order.itemid });
    const itemidarray = order.itemidarray;
    const points = await Point.findOne({ dbuserid: order.userid });

    if (
      (data.status && data.data.status === "success" && order.status === "Created") ||
      (order.paymentmode === "wallet" && order.status === "Created")
    ) {

      order = await Order.findOneAndUpdate(
        { orderid: client_txn_id },
        { status: "Queued" },
        { new: true }
      );

      //if product is smileone
      if (product.isApi && item.isApi && (item.apiType === "SMILEBR" || item.apiType === "SMILEPH") && (order.status === "Queued")) {
        const completeSmileOneOrder = await processSmileOneOrder(client_txn_id, itemidarray, item, product, order, date);

        //if smile recharge success
        if (completeSmileOneOrder) {
          await Order.findOneAndUpdate(
            { transactionid: client_txn_id },
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
            `Your order ${client_txn_id} has been completed successfully`,
            `Order Number : ${client_txn_id}\n\n
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
            // UPI transaction id : ${utr}\n\n
          );

        }
        //if smile recharge fails
        else {
          await Order.findOneAndUpdate(
            { transactionid: client_txn_id },
            { status: "Processing", date, product_name: product.name }
          );

          sendEmail(
            process.env.EMAIL,
            `Gray - New Order Received!`,
            `Order Number : ${client_txn_id}\n\n
            Order Date : ${date}\n\n
            Product Name : ${product.name}\n\n
            Item : ${order.itemname}\n\n
            UserId : ${order.input1}\n\n
            ServerId : ${order.input2}\n\n
            Price : ₹${order.value}\n\n`
          );
        }
      }
      else if (product.isApi && item.isApi && (item.apiType === "MOOGOLDMLBB" || item.apiType === "MOOGOLDGENSHIN" || item.apiType === "MOOGOLDPUBG" || item.apiType === "MOOGOLDHOK") && (order.status === "Queued")) {

        const completeMoogoldOrder = await processMoogoldApiOrder(client_txn_id, itemidarray, item, product, order, date);

        //if moogold recharge success
        // console.log("completeMoogoldOrder :", completeMoogoldOrder);

        if (completeMoogoldOrder) {
          // console.log("Order completed successfully. Updating status to Completed.");

          await Order.findOneAndUpdate(
            { transactionid: client_txn_id },
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
            `Your order ${client_txn_id} has been completed successfully`,
            // `Order Number : ${data.result.orderId}\n\n
            `Order Number : ${client_txn_id}\n\n
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
            // UPI transaction id : ${utr}\n\n
          );
        }

        //if moogold recharge fails
        else {
          await Order.findOneAndUpdate(
            { transactionid: client_txn_id },
            { status: "Processing", date, product_name: product.name }
          );
          sendEmail(
            process.env.EMAIL,
            `Gray - New Order Received!`,
            `Order Number : ${client_txn_id}\n\n
            Order Date : ${date}\n\n
            Product Name : ${product.name}\n\n
            Item : ${order.itemname}\n\n
            UserId : ${order.input1}\n\n
            ServerId : ${order.input2}\n\n
            Price : ₹${order.value}\n\n`
          );
        }

      }
      //if product is manual
      else {
        await Order.findOneAndUpdate(
          { transactionid: client_txn_id },
          { status: "Processing", date, product_name: product.name }
        );

        sendEmail(
          process.env.EMAIL,
          `Gray - New Order Received!`,
          // `Order Number : ${data.result.orderId}\n\n
          `Order Number : ${client_txn_id}\n\n
          Order Date : ${date}\n\n
          Product Name : ${product.name}\n\n
          Item : ${order.itemname}\n\n
          UserId : ${order.input1}\n\n
          ServerId : ${order.input2}\n\n
          Price : ₹${order.value}\n\n
          `
        );

      }
    }
    //if payment is pending
    else if (data.status && data.data.status === "failure") {
      await Order.findOneAndUpdate(
        { transactionid: client_txn_id },
        { status: "Failed" }
      );
      // sendEmail(data.data.customer_email, `Order Failed`, "Order Details");
    }

    const updatedOrder = await Order.findOne({ transactionid: client_txn_id });

    const newData = {
      ...data,
      order: updatedOrder,
    };

    res.status(200).json(newData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};