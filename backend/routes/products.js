import express from "express";
import { getAllProducts, getProduct, getHomeProducts } from "../controller/products.js";
import { authCheck, checkScopes } from "../middleware/verifyToken.js";
import { isAdmin, verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/gethomeproducts",getHomeProducts);
router.get("/eachproduct/:_id",getProduct);
router.get("/allproducts",verifyToken,isAdmin,getAllProducts);
export default router;