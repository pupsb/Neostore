import Items from "../models/Items.js";
import Order from "../models/Orders.js";
import Products from "../models/Products.js";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

function generateUniqueId() {
  const timestamp = Date.now(); // Get the current timestamp
  const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
  return `${timestamp}-${randomNum}`; // Combine them to form the unique ID
}

export const wallet = async (req, res) => {
  try {
    const { userid, input1, input2, paymentmode, itemid, product_id } = req.body;
    // console.log(req.body);
    
    const wallet = await Wallet.findOne({ dbuserid: userid });
    // console.log(userid)
    const balance = parseInt(wallet.balance);
    const item = await Items.findOne({ itemid: itemid });
    const product = await Products.findById(product_id);
    // console.log(product);
    
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

    const number = parseFloat(value);
    const uniqueId = generateUniqueId();
    const itemidarray = item.itemidarray;

    if(balance < number){
      res.status(200).json({msg : "Not Enough Balance","redirect_url": `${process.env.REDIRECT_DOMAIN}/balanceerror`});
      return;
    }
   

    const newOrder = new Order({
      orderid: uniqueId,
      itemname,
      productid,
      dbproductid,
      useremail : userInformation.email,
      productname : product.name,
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
    wallet.balance -= number;
    await wallet.save();

    const transactionId = generateUniqueId()

    const transaction = new Transaction({
      txnid :  transactionId,
      orderid : uniqueId,
      userid : userInformation.userid,
      useremail : userInformation.email,
      amount: value,
      type : "Debit",
      status : "Success",
      walletid : wallet._id,

    });

    await transaction.save();

    const savedOrder = await newOrder.save();
    // res.status(200).json({"redirect_url": `https://senofficial.in/confirmation?client_txn_id=${uniqueId}`});
    res.status(200).json({
      redirect_url: `${process.env.REDIRECT_DOMAIN}/confirmation?client_txn_id=${uniqueId}`
    });


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log("controller: ", userId);
    
    const orders = await Order.find({ userid: userId });
    orders.reverse();
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ error: err.message });
  }
};
