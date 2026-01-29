import mongoose from "mongoose";

const itemsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type : {
    type:String,
  },
  suggestedTask: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  itemid: {
    type: Number,
    required: true,
    unique: true,
  },
  itemidarray: {
    type: Array,
    required: true,
    default : [],
  },
  originalprice: {
    type: Number,
    required: true,
  },
  discountedprice: {
    type: Number,
    required: true,
  },
  resellprice: {
    type: Number,
    required: true,
  },
  isApi: {
    type: Boolean,
    default: false,
    required: true,
  },
  apiType: {
    type: String,
    // required: true,
  },
  category: {
    type: String,
    // required: true,
  },
  imgpath: {
    type: String,
    default: "",
  },
},
{ timestamps: true }
);

const Items = mongoose.model("Items", itemsSchema);
export default Items;
