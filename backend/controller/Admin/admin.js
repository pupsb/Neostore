import { sendEmail } from "../../mailer.js";
import Items from "../../models/Items.js";
import Order from "../../models/Orders.js";
import Point from "../../models/Points.js";
import Transaction from "../../models/Transaction.js";
import User from "../../models/User.js";
import Wallet from "../../models/Wallet.js";
import Product from "../../models/Products.js";

function generateUniqueId() {
  const timestamp = Date.now(); // Get the current timestamp
  const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
  return `${timestamp}-${randomNum}`; // Combine them to form the unique ID
}

export const getProcessingOrders = async (req, res) => {
  try {
    const processingOrders = await Order.find({ status: "Processing" });
    processingOrders.reverse();
    res.status(200).send(processingOrders);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const getUsersData = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Fetch users sorted by most recent
    const usersData = await User.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
      .skip((page - 1) * limit)
      .limit(limit);

    const walletBalance = await Wallet.find();

    // Merge users with wallet balance
    const mergedData = usersData.map(user => {
      const wallet = walletBalance.find(w => w.userid === user.userid);
      return {
        ...user._doc,
        balance: wallet ? wallet.balance : 0,
      };
    });

    // Send paginated data back
    res.status(200).send({
      users: mergedData,
      totalPages: Math.ceil(await User.countDocuments() / limit),
      totalCount: await User.countDocuments(), // Return the total count of users
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId, status1, reason1 } = req.params;
    const order = await Order.findOne({ _id: orderId });

    const userInformation = await User.findOne({ _id: order.userid });
    const wallet = await Wallet.findOne({ dbuserid: order.userid });

    const updatedOrder = await Order.findByIdAndUpdate(orderId, {
      status: status1,
      reason: reason1,
    });
    console.log(status1 === "Completed")
    if (status1 === "Completed") {
      // console.log("in")
      try {
        const points = await Point.findOne({ dbuserid: order.userid });
        let newBalance = points.balance;
        newBalance += order.value / process.env.POINTS_RATIO;


        const transaction = {
          type: "credit",
          amount: order.value,
        };
        const updatedPoint = await Point.findOneAndUpdate(
          { dbuserid: order.userid },
          { balance: newBalance, $push: { transactions: transaction } },
          { new: true }
        );
        console.log(updatedPoint);
      } catch (err) {
        console.log(err.message)
      }
    }
    if (status1 === "Completed") {

      sendEmail(
        order.customer_email,
        `Your order ${order.orderid} has been completed succesfully`,
        `Order Number : ${order.orderid}\n\n
        Order Date : ${order.date}\n\n
        Product Name : ${order.product_name}\n\n
        Item : ${order.itemname}\n\n
        UserId : ${order.input1}\n\n
        ServerId : ${order.input2}\n\n
        Price : ₹${order.value}\n\n
        UPI transaction id : ${order.upi_txn_id}\n\n
        
        Thank you for purchasing from Woex Supply\n\n
        
        If you have any issues related to the order, kindly contact customer service via Live Chat. Our Live Chat is located at the bottom right of our website.\n\n
        Best Regards,\n\n
        Woex Supply`
      );
      // Customer VPA : ${order.customer_vpa}
    } else if (status1 === "Refunded") {
      const transactionId = generateUniqueId();

      const transaction = new Transaction({
        txnid: transactionId,
        userid: userInformation.userid,
        useremail: userInformation.email,
        amount: order.value,
        type: "Refunded",
        status: "Success",
        walletid: wallet._id,
      });

      await transaction.save();
      // console.log(order.value)
      wallet.balance += parseInt(order.value);
      await wallet.save();

      try {
        sendEmail(
          order.customer_email,
          `Your order cannot be completed!`,
          `We regret to inform you that your order could not be completed.\n\n
        Reson : ${reason1}\n\n
        We will initiate a refund amount to your source account. The amount will reflect in your account within 24 hours.\n\n
        Order Number : ${order.orderid}\n\n
        Order Date : ${order.date}\n\n
        Product Name : ${order.product_name}\n\n
        Item : ${order.itemname}\n\n
        UserId : ${order.input1}\n\n
        ServerId : ${order.input2}\n\n
        Price : ₹${order.value}\n\n
        UPI transaction id : ${order.upi_txn_id}\n\n
        Customer VPA : ${order.customer_vpa}\n\n
        
        Thank you for purchasing from Woex Supply\n\n
        
        If you have any issues related to the order, kindly contact customer service via Live Chat. Our Live Chat is located at the bottom right of our website.\n\n
        Best Regards,\n\n
        Woex Supply`
        );
      } catch (err) {
        console.log(err.message);
      }
    }

    res.status(200).send(updatedOrder);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { price, resellPrice, itemInstock } = req.body;

    // Create an object to hold the update data
    const updateData = {};

    // Only add the fields to the updateData object if they are not null or undefined
    if (price) {
      updateData.discountedprice = price;
    }
    if (resellPrice) {
      updateData.resellprice = resellPrice;
    }
    if (itemInstock !== null && itemInstock !== undefined) {
      updateData.inStock = itemInstock;
    }

    // Update the item only with the fields that are not null or undefined
    const updatedItem = await Items.findByIdAndUpdate(itemId, updateData, { new: true });

    if (!updatedItem) {
      return res.status(404).send({ error: 'Item not found or failed to update.' });
    }

    res.status(200).send(updatedItem);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


export const allTxn = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default rows per page is 10
    const skip = (page - 1) * limit;

    // Fetch transactions sorted by most recent
    const allTxn = await Order.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.status(200).send({
      transactions: allTxn,
      totalTxns: total,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const allWalletTxn = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Use the limit from the request
    const skipIndex = (page - 1) * limit;

    const totalItems = await Transaction.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const transactions = await Transaction.find()
      .sort({ updatedAt: -1 })
      .skip(skipIndex)
      .limit(limit);

    res.status(200).send({
      transactions,
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const stats = async (req, res) => {
  try {
    const allTxn = await Order.find();
    let processing = 0;
    let completed = 0;
    let refunded = 0;
    let totalSale = 0;
    for (let i = 0; i < allTxn.length; i++) {
      if (allTxn[i].status === "Processing") {
        processing++;
      } else if (allTxn[i].status === "Completed") {
        completed++;
        totalSale += Number(allTxn[i].value);
      } else if (allTxn[i].status === "Refunded") {
        refunded++;
      }
    }
    const result = {
      processing: processing,
      completed: completed,
      refunded: refunded,
      total_sale: totalSale,
      total_order: allTxn.length,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { _id, instock, importantNote } = req.body;
    // console.log(_id, instock, importantNote);

    // Validate the input
    if (!_id || instock === undefined) {
      return res.status(400).send({ error: 'Missing parameters' });
    }

    // Update the instock field in the Product collection
    let updateData = { instock };

    if (importantNote) {
      updateData.importantnote = importantNote; // Add importantNote if it exists
    }

    const updatedProduct = await Product.findOneAndUpdate({ _id: _id }, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.status(200).send(updatedProduct);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};


export const addUserWalletBalance = async (req, res) => {
  try {
    const { userId, email, amount } = req.body;
    console.log('[ADD BALANCE] Request received:', { userId, email, amount });

    if (amount <= 0) {
      console.log('[ADD BALANCE] Invalid amount:', amount);
      return res.status(400).send({ error: "Invalid amount" });
    }

    // Fetch the user
    const user = await User.findOne({ userid: userId, email: email });
    console.log('[ADD BALANCE] User found:', user ? { _id: user._id, userid: user.userid, email: user.email } : null);
    if (!user) {
      console.log('[ADD BALANCE] User not found for:', { userId, email });
      return res.status(404).send({ error: "User not found" });
    }

    // Fetch the wallet
    const wallet = await Wallet.findOne({ dbuserid: user._id });
    console.log('[ADD BALANCE] Wallet query:', { dbuserid: user._id });
    console.log('[ADD BALANCE] Wallet found:', wallet ? { _id: wallet._id, balance: wallet.balance } : null);
    if (!wallet) {
      console.log('[ADD BALANCE] Wallet not found for user._id:', user._id);
      return res.status(404).send({ error: "Wallet not found" });
    }

    // Generate transaction ID
    const txnId = generateUniqueId();

    // Create a new transaction
    const transaction = new Transaction({
      txnid: txnId,
      orderid: "Admin-Refill",
      status: "Success",
      userid: wallet.userid,
      useremail: wallet.useremail,
      amount: amount,
      type: "Credit",
      walletid: wallet._id,
    });

    // Save the transaction
    const savedTxn = await transaction.save();

    // Update the wallet balance
    const newBalance = wallet.balance + parseInt(amount, 10);
    wallet.balance = newBalance;
    const updatedWallet = await wallet.save();

    console.log('[ADD BALANCE] Success! New balance:', updatedWallet.balance);
    res.status(200).send({ transaction: savedTxn, wallet: updatedWallet });
  } catch (error) {
    console.error("Error in addUserWalletBalance:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export const updateUserData = async (req, res) => {
  try {

    const { name, mobilenumber, email, role, verified, isBlocked, userid, _id } = req.body;

    // Find user by userid
    const user = await User.findOne({ _id: _id, userid: userid });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the mobilenumber is already used by another user
    const mobileConflict = await User.findOne({ mobilenumber, _id: { $ne: _id } });
    if (mobileConflict) {
      return res.status(400).send({ message: "Mobile number is already in use by another user." });
    }

    // Check if the email is already used by another user
    const emailConflict = await User.findOne({ email, _id: { $ne: _id } });
    if (emailConflict) {
      return res.status(400).send({ message: "Email is already in use by another user." });
    }

    // Update user data
    user.name = name;
    user.mobilenumber = mobilenumber;
    user.email = email;
    user.role = role;
    user.verified = verified;
    user.isBlocked = isBlocked;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).send(updatedUser);
  }
  catch (error) {
    console.error("Error in updateUserData:", error);
    res.status(500).send({ error: "Internal server error" });
  }
}

export const createitem = async (req, res) => {
  try {
    const { name, type, suggestedTask, itemidarray, originalprice, discountedprice, resellprice, isApi, apiType, imgpath } = req.body;

    // Validate the input
    if (!name || !originalprice || !discountedprice || !resellprice || !imgpath) {
      return res.status(400).send({ error: 'Missing parameters' });
    }

    // Get all item IDs from the database
    const allItems = await Items.find({});
    const existingItemIds = allItems.map(item => item.itemid);

    // Find the next available item ID
    let newItemId = 1;
    while (existingItemIds.includes(newItemId)) {
      newItemId++;
    }

    // Create a new item
    const newItem = new Items({
      name,
      type,
      suggestedTask,
      itemid: newItemId,  // Assign the new available item ID
      itemidarray,
      originalprice,
      discountedprice,
      resellprice,
      isApi,
      apiType,
      imgpath,
    });

    // Save the item
    const savedItem = await newItem.save();

    res.status(201).send({ saveditem: savedItem });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

export const createproduct = async (req, res) => {
  try {
    console.log('=== Create Product Request ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { name, type, category, imgpath, importantnote, inputs, items, istrending, isApi, apiType } = req.body;

    // Validate the input
    if (!name || !type || !category || !imgpath || !inputs || !items) {
      console.log('Validation failed - missing parameters');
      console.log({ name: !!name, type: !!type, category: !!category, imgpath: !!imgpath, inputs: !!inputs, items: !!items });
      return res.status(400).send({ error: 'Missing parameters' });
    }

    // If itemids in the database are numbers
    const itemsAsNumbers = items.map(item => Number(item)); // Convert all itemids to numbers
    console.log('Items as numbers:', itemsAsNumbers);
    
    const foundItems = await Items.find({ itemid: { $in: itemsAsNumbers } });
    console.log('Found items in DB:', foundItems.map(i => i.itemid));
    
    const foundItemIds = foundItems.map(item => item.itemid);

    // Get all product IDs from the database
    const allProducts = await Product.find({});
    const existingProductIds = allProducts.map(product => product.productid);
    console.log('Existing product IDs:', existingProductIds);

    // Find the next available product ID
    let newProductId = 1;
    while (existingProductIds.includes(newProductId)) {
      newProductId++;
    }
    console.log('New product ID:', newProductId);

    // Create a new product
    const newProduct = new Product({
      name,
      type,
      productid: newProductId,  // Assign the new available product ID
      category,
      imgpath,
      importantnote,
      inputs,
      items, // Store only itemids
      istrending,
      isApi,
      apiType,
    });

    console.log('Attempting to save product:', JSON.stringify(newProduct, null, 2));
    
    // Save the product
    const savedProduct = await newProduct.save();
    console.log('Product saved successfully:', savedProduct._id);

    res.status(201).send({ savedproduct: savedProduct });
  } catch (err) {
    console.error('=== Error in createproduct ===');
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).send({ error: err.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const allItems = await Items.find();
    res.status(200).send(allItems);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).send(allProducts);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findOneAndDelete({ productid: productId });

    if (!deletedProduct) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.status(200).send(deletedProduct);
  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await Items.findOneAndDelete({ itemid: itemId });

    if (!deletedItem) {
      return res.status(404).send({ error: 'Item not found' });
    }

    res.status(200).send(deletedItem);
  }
  catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export const editItem = async (req, res) => {

  try {
    const { itemId } = req.params;
    const { name, type, suggestedTask, itemidarray, originalprice, discountedprice, resellprice, imgpath } = req.body;

    // Validate the input
    if (!name || !originalprice || !discountedprice || !resellprice || !imgpath) {
      return res.status(400).send({ error: 'Missing parameters' });
    }

    // Find the item by itemid
    const item = await Items.findOne({ itemid: itemId });
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }

    // Update the item
    item.name = name;
    item.type = type;
    item.suggestedTask = suggestedTask;
    item.itemidarray = itemidarray;
    item.originalprice = originalprice;
    item.discountedprice = discountedprice;
    item.resellprice = resellprice;
    item.imgpath = imgpath;

    // Save the updated item
    const updatedItem = await item.save();

    res.status(200).send(updatedItem);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in editProduct:", error);
    res.status(500).json({ message: error.message });
  }
};