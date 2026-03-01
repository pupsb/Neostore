import express from "express";
import { getLeaderboard, getLeaderboardHistory, archiveMonth, archivePastMonth } from "../controller/leaderboard.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public - Get current month leaderboard
router.get("/", getLeaderboard);

// Public - Get past month winners
router.get("/history", getLeaderboardHistory);

// Admin only - Archive current month and distribute rewards
router.post("/archive", verifyToken, isAdmin, archiveMonth);

// Admin only - Recover/archive a past month's leaderboard
router.post("/recover", verifyToken, isAdmin, archivePastMonth);

export default router;
