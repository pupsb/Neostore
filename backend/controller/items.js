import Product from "../models/Products.js";
import Items from "../models/Items.js";

// Fields safe to expose on public item endpoints
const PUBLIC_ITEM_FIELDS = 'name type suggestedTask inStock itemid discountedprice originalprice resellprice imgpath isApi apiType';

// Weekly-pass API types (used to compute hasWeeklyPass boolean)
const WEEKLY_PASS_API_TYPES = ['SMILEBR', 'SMILEPH', 'MOOGOLDMLBB'];

/**
 * Transforms a raw item document into a public-safe object.
 * - apiType → hasWeeklyPass (boolean)
 * - Strips isApi, apiType, itemidarray, timestamps, __v
 */
const sanitizeItem = (itemObj) => {
  const { isApi, apiType, itemidarray, createdAt, updatedAt, __v, ...safe } = itemObj;
  return { ...safe, hasWeeklyPass: WEEKLY_PASS_API_TYPES.includes(apiType) };
};

export const getItems = async (req, res) => {
  try {
    const { _id } = req.params;
    // console.log("ID: ", _id);

    // Find the product by ID
    const product = await Product.findById(_id);
    // console.log("Product: ", product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Use the product's items array to find matching items in the Items collection
    // Only select public-safe fields
    const items = await Items.find({ itemid: { $in: product.items } }).select(PUBLIC_ITEM_FIELDS);
    // console.log("Items: ", items);

    // Sanitize items
    const sanitizedItems = items.map(item => sanitizeItem(item.toObject()));

    // Sort the items by itemid
    sanitizedItems.sort((a, b) => (a.itemid < b.itemid ? -1 : a.itemid > b.itemid ? 1 : 0));

    // Respond with the sorted items
    res.status(200).json(sanitizedItems);
  } catch (err) {
    console.error("Error: ", err.message);
    res.status(500).send({ error: err.message });
  }
};
