import express from "express";
import { login, createTempUser, verifyAndRegister, verifyMail} from "../controller/Auth/auth.js";
import { validateUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
// router.post("/register", register);
router.post("/createaccount", createTempUser);
router.post("/verifyandregister", verifyAndRegister);
router.post("/verifymail/:id/:token", verifyMail);
router.post("/validateuser", validateUser);
export default router;