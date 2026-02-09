import mongoose from "mongoose";

const leaderboardHistorySchema = mongoose.Schema(
  {
    month: {
      type: Date,
      required: true,
      unique: true,
    },
    monthLabel: {
      type: String, // e.g., "January 2026"
      required: true,
    },
    winners: [
      {
        rank: {
          type: Number,
          required: true,
        },
        userId: {
          type: String,
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        totalSpend: {
          type: Number,
          required: true,
        },
        rewardPoints: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const LeaderboardHistory = mongoose.model("LeaderboardHistory", leaderboardHistorySchema);
export default LeaderboardHistory;
