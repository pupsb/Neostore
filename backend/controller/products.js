import Product from "../models/Products.js";
import Items from "../models/Items.js";
import mongoose from "mongoose";

// Fields safe to expose on public product endpoints
const PUBLIC_PRODUCT_FIELDS = 'name type category productid imgpath istrending importantnote instock isApi inputs';
// Fields safe to expose on public item endpoints
const PUBLIC_ITEM_FIELDS = 'name type suggestedTask inStock itemid discountedprice originalprice resellprice imgpath isApi apiType';

// Weekly-pass API types (used to compute hasWeeklyPass boolean)
const WEEKLY_PASS_API_TYPES = ['SMILEBR', 'SMILEPH', 'MOOGOLDMLBB'];

/**
 * Transforms a raw product document into a public-safe object.
 * - isApi → instantDelivery
 * - Strips isApi, apiType, timestamps, __v
 */
const sanitizeProduct = (productObj) => {
  const { isApi, apiType, createdAt, updatedAt, __v, ...safe } = productObj;
  return { ...safe, instantDelivery: !!isApi };
};

/**
 * Transforms a raw item document into a public-safe object.
 * - apiType → hasWeeklyPass (boolean)
 * - Strips isApi, apiType, itemidarray, timestamps, __v
 */
const sanitizeItem = (itemObj) => {
  const { isApi, apiType, itemidarray, createdAt, updatedAt, __v, ...safe } = itemObj;
  return { ...safe, hasWeeklyPass: WEEKLY_PASS_API_TYPES.includes(apiType) };
};

export const getHomeProducts = async(req,res) => {
  try{
    const trending = await Product.find({istrending : "true", instock: "true"}).select(PUBLIC_PRODUCT_FIELDS);
    const instantGames = await Product.find({category : "instant-games", instock: "true"}).select(PUBLIC_PRODUCT_FIELDS);
    const games= await Product.find({category : "games", instock: "true"}).select(PUBLIC_PRODUCT_FIELDS);
    const ott= await Product.find({category : "ott", instock: "true"}).select(PUBLIC_PRODUCT_FIELDS);
    const others= await Product.find({category : "others", instock: "true"}).select(PUBLIC_PRODUCT_FIELDS);

    // Sanitize all product arrays before sending
    res.status(200).json({
      trending: trending.map(p => sanitizeProduct(p.toObject())),
      instantGames: instantGames.map(p => sanitizeProduct(p.toObject())),
      games: games.map(p => sanitizeProduct(p.toObject())),
      ott: ott.map(p => sanitizeProduct(p.toObject())),
      others: others.map(p => sanitizeProduct(p.toObject())),
    });
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

    // Fetch the product by ID (only public-safe fields)
    const product = await Product.findById(_id).select(PUBLIC_PRODUCT_FIELDS);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch items associated with the product (only public-safe fields)
    const items = await Items.find({ productid: _id }).select(PUBLIC_ITEM_FIELDS);

    // Sanitize product and items before sending
    const sanitizedProduct = sanitizeProduct(product.toObject());
    const sanitizedItems = items.map(item => sanitizeItem(item.toObject()));

    res.status(200).json({
      ...sanitizedProduct,
      items: sanitizedItems,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin-only endpoint — returns ALL fields (protected by auth middleware)
export const getAllProducts = async(req,res) => {
  try{
    const product = await Product.find();
    res.status(200).json(product);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
}