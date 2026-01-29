import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getTransactions, getWalletBalance, topUp, txnStatus } from "../controller/wallet.js";
import { expayTopUp, expayTxnStatus, expayWalletWebhook } from "../controller/PaymentGateway/expaywallet.js";


const router = express.Router();

// UpiGateway
router.post("/topup",verifyToken,topUp)
router.post("/txnstatus",verifyToken,txnStatus);

// ExPay3 Gateway
router.post("/expay/topup",verifyToken,expayTopUp)
router.post("/expay/txnstatus",verifyToken,expayTxnStatus);
router.post("/expay/webhook",expayWalletWebhook); // No auth - uses signature verification



router.get("/getbalance/:userid",verifyToken,getWalletBalance);
router.get("/gettransactions/:userid",verifyToken,getTransactions);


export default router;