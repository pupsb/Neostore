import express from "express";
import { getImages } from "../controller/home.js";

const router = express.Router();

router.get("/images", getImages);

export default router;