import express from "express"
import { getItems } from "../controller/items.js";

const router = express.Router();

router.get("/:_id",getItems)

export default router;