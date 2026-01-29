import Product from "../models/Products.js";
import Items from "../models/Items.js";


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
    const items = await Items.find({ itemid: { $in: product.items } });
    // console.log("Items: ", items);

    // Sort the items by itemid
    items.sort((a, b) => (a.itemid < b.itemid ? -1 : a.itemid > b.itemid ? 1 : 0));

    // Respond with the sorted items
    res.status(200).json(items);
  } catch (err) {
    console.error("Error: ", err.message);
    res.status(500).send({ error: err.message });
  }
};
