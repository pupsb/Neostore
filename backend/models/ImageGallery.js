import mongoose from "mongoose";

const imageSchema = mongoose.Schema(
  { 
    title: {
      type: String,
      required: true
    },
    
    url: {
      type: String,
      required: true,
    },
    redirectUrl: {
      type: String,
    },
    id : {
      type: String,
      required: true,
    },
   
    type: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true
  }
)

const Gallery = mongoose.model("Gallery", imageSchema);
export default Gallery;