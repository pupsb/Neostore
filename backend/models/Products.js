import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name : {
      type:String,
      required:  true
    },
    type : {
      type:String,
      required:  true
    },
    category : {
      type:String,
      default: " ",
      required:  true
    },
    productid : {
      type: Number,
      required:  true,
      unique: true,
    },
    imgpath : {
      type:String,
      default : "",
      required:  true
    },
    istrending : {
      type:Boolean,
      required:  true,
    },
    importantnote : {
      type:String,
      default : "",
      required:  true,
    },
    inputs : {
      type : Array,
      default : [],
      required:  true,
    },
    items : {
      type : Array,
      default : [],
    },
    instock : {
      type:Boolean,
      default : true,
    },
    isApi : {
      type: Boolean,
      default : true,
    },
    apiType : {
      type:String,
      default : "",
    },
  },
  { timestamps: true }
)

const Product = mongoose.model("Product",productSchema);
export default Product;