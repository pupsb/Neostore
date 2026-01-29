import express from "express";
import { allTxn, getProcessingOrders, getUsersData, stats, updateOrder, allWalletTxn, addUserWalletBalance, updateUserData, createitem, createproduct, getAllProducts, getAllItems, updateItem, updateProduct, deleteProduct, deleteItem, editItem, editProduct} from "../controller/Admin/admin.js";
import {uploadImage, getImages, deleteImage} from "../controller/Admin/adminGallery.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";
import { queryPoints, queryPointsPh } from "../controller/Admin/queryPoints.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/processing",verifyToken,isAdmin,getProcessingOrders);
router.get("/users_data",verifyToken,isAdmin,getUsersData);
router.get("/alltxn",verifyToken,isAdmin,allTxn);
router.get("/stats", verifyToken, isAdmin, stats);
router.get("/updateorder/:orderId/:status1/:reason1",verifyToken,isAdmin,updateOrder);
// router.get("/updateitem/:itemId/:price",verifyToken,isAdmin,updatePrice);
router.post("/updateitem/:itemId", verifyToken, isAdmin, updateItem); // Added resellPrice
router.post("/updateproduct", verifyToken, isAdmin, updateProduct);
router.post("/editproduct/:id", verifyToken, isAdmin, editProduct);
router.post("/querypoints", verifyToken, isAdmin, queryPoints);
router.post("/querypoints/:ph", verifyToken, isAdmin, queryPointsPh);

router.get("/allwallettxn",verifyToken,isAdmin,allWalletTxn);
router.post("/adduserbalance", verifyToken, isAdmin, addUserWalletBalance);
router.post ("/updateuserdata", verifyToken, isAdmin, updateUserData);
router.post('/uploadimage', verifyToken, isAdmin, upload.array('images', 10), uploadImage);
router.get('/imagegallery', verifyToken, isAdmin, getImages);
router.post('/deleteimage/:imageId', verifyToken, isAdmin, deleteImage);
router.post('/createitem', verifyToken, isAdmin, createitem);
router.post('/createproduct', verifyToken, isAdmin, createproduct);

router.get("/getallproducts", verifyToken, isAdmin, getAllProducts);
router.get("/getallitems", verifyToken, isAdmin, getAllItems);

router.post("/deleteproduct/:productId", verifyToken, isAdmin, deleteProduct);
router.post("/deleteitem/:itemId", verifyToken, isAdmin, deleteItem);


router.post("/edititem/:itemId", verifyToken, isAdmin, editItem);


export default router;