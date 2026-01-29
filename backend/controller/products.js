import Product from "../models/Products.js";
import Items from "../models/Items.js";
import mongoose from "mongoose";

export const getHomeProducts = async(req,res) => {
  try{
    const trending = await Product.find({istrending : "true", instock: "true"});
    const instantGames = await Product.find({category : "instant-games", instock: "true"});
    const games= await Product.find({category : "games", instock: "true"});
    const ott= await Product.find({category : "ott", instock: "true"});
    const others= await Product.find({category : "others", instock: "true"});
    
    res.status(200).json({trending, instantGames, games, ott, others});
  }
  catch(err){
    res.status(500).json({ message: err.message });
  }
}

export const getProduct = async (req, res) => {
  try {
    const { _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    // Fetch the product by ID
    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch items associated with the product
    const items = await Items.find({ productid: _id });

    // Add items to the product object
    const productWithItems = {
      ...product.toObject(),
      items, // Embed the items directly in the product
    };
    // console.log(productWithItems);
    

    res.status(200).json(productWithItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async(req,res) => {
  try{
    const product = await Product.find();
    res.status(200).json(product);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
}