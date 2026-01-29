import express from "express"
import {authCheck} from "../middleware/verifyToken.js";
import { checkApiKey, verifyToken } from "../middleware/auth.js";
import {getOrders, wallet } from "../controller/order.js";
import { checkId } from "../controller/IdChecker/checkMl.js";
import {ugOrderStatus, upiGateway} from "../controller/PaymentGateway/ugorders.js"
import {createExpayOrder, checkExpayOrderStatus, expayWebhook} from "../controller/PaymentGateway/expayorders.js"

const router = express.Router();

//For UPIGateway
router.post("/createOrder",checkApiKey,verifyToken,upiGateway)
router.post("/orderstatus",verifyToken,ugOrderStatus);

// For ExPay3 Gateway
router.post("/expay/createOrder",checkApiKey,verifyToken,createExpayOrder)
router.post("/expay/orderstatus",verifyToken,checkExpayOrderStatus);
router.post("/expay/webhook",expayWebhook); // No auth - uses signature verification

router.post("/createWalletOrder",checkApiKey,verifyToken,wallet)

router.post("/checkid",checkId)

router.get("/:userId", verifyToken, getOrders)


export default router;