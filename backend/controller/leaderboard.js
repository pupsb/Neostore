import Order from "../models/Orders.js";
import User from "../models/User.js";
import Point from "../models/Points.js";
import LeaderboardHistory from "../models/LeaderboardHistory.js";

// Helper: Get display name (full name, not masked)
const getDisplayName = (name) => {
  if (!name || name.trim() === "") return "User";
  return name;
};

// Helper: Get start of current month
const getStartOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

// Helper: Get end of current month (start of next month)
const getEndOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
};

// GET /leaderboard - Get current month leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const startOfMonth = getStartOfMonth();
    const endOfMonth = getEndOfMonth();

    // Aggregate completed orders for current month
    const leaderboardData = await Order.aggregate([
      {
        $match: {
          status: "Completed",
          createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$userid",
          totalSpend: { $sum: { $toDouble: "$value" } },
          useremail: { $first: "$useremail" },
        },
      },
      { $sort: { totalSpend: -1 } },
      { $limit: 50 },
    ]);

    // Enrich with user names - try multiple lookup strategies
    const enrichedLeaderboard = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        // Try finding user by userid first, then by _id
        let user = await User.findOne({ userid: entry._id });
        
        // If not found, try finding by MongoDB _id (in case orders store db ObjectId)
        if (!user) {
          try {
            user = await User.findById(entry._id);
          } catch (e) {
            // entry._id is not a valid ObjectId, skip
          }
        }
        
        // If still not found, try useremail from orders as a fallback
        if (!user && entry.useremail) {
          user = await User.findOne({ email: entry.useremail });
        }
        
        return {
          rank: index + 1,
          odbc_id: entry._id,
          userName: getDisplayName(user?.name),
          totalSpend: Math.round(entry.totalSpend),
        };
      })
    );

    // Calculate time until month end
    const now = new Date();
    const msUntilReset = endOfMonth.getTime() - now.getTime();
    const daysUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60 * 24));
    const hoursUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    res.status(200).json({
      month: startOfMonth.toLocaleString("default", { month: "long", year: "numeric" }),
      resetIn: {
        days: daysUntilReset,
        hours: hoursUntilReset,
        timestamp: endOfMonth.toISOString(),
      },
      rewards: {
        first: parseInt(process.env.LEADERBOARD_REWARD_1ST) || 500,
        second: parseInt(process.env.LEADERBOARD_REWARD_2ND) || 300,
        third: parseInt(process.env.LEADERBOARD_REWARD_3RD) || 100,
      },
      leaders: enrichedLeaderboard,
    });
  } catch (err) {
    console.error("[LEADERBOARD] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET /leaderboard/history - Get past month winners
export const getLeaderboardHistory = async (req, res) => {
  try {
    const history = await LeaderboardHistory.find()
      .sort({ month: -1 })
      .limit(12); // Last 12 months

    res.status(200).json({
      history: history.map((h) => ({
        month: h.monthLabel,
        winners: h.winners,
      })),
    });
  } catch (err) {
    console.error("[LEADERBOARD HISTORY] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Helper: Archive a specific month's leaderboard data
const archiveMonthData = async (targetStart, targetEnd, distributeRewards = true) => {
  const monthLabel = targetStart.toLocaleString("default", { month: "long", year: "numeric" });

  // Check if already archived
  const existing = await LeaderboardHistory.findOne({ month: targetStart });
  if (existing) {
    return { alreadyArchived: true, monthLabel };
  }

  // Get top 3
  const leaderboardData = await Order.aggregate([
    {
      $match: {
        status: "Completed",
        createdAt: { $gte: targetStart, $lt: targetEnd },
      },
    },
    {
      $group: {
        _id: "$userid",
        totalSpend: { $sum: { $toDouble: "$value" } },
        useremail: { $first: "$useremail" },
      },
    },
    { $sort: { totalSpend: -1 } },
    { $limit: 3 },
  ]);

  if (leaderboardData.length === 0) {
    return { noData: true, monthLabel };
  }

  // Get reward amounts from env
  const rewards = [
    parseInt(process.env.LEADERBOARD_REWARD_1ST) || 500,
    parseInt(process.env.LEADERBOARD_REWARD_2ND) || 300,
    parseInt(process.env.LEADERBOARD_REWARD_3RD) || 100,
  ];

  // Build winners array and optionally distribute rewards
  const winners = await Promise.all(
    leaderboardData.map(async (entry, index) => {
      let user = await User.findOne({ userid: entry._id });
      if (!user) {
        try { user = await User.findById(entry._id); } catch (e) {}
      }
      if (!user && entry.useremail) {
        user = await User.findOne({ email: entry.useremail });
      }

      const rewardPoints = rewards[index] || 0;

      // Add points to user (only if distributing rewards)
      if (distributeRewards && rewardPoints > 0 && user) {
        await Point.findOneAndUpdate(
          { userid: entry._id },
          {
            $inc: { balance: rewardPoints },
            $push: {
              transactions: {
                type: "leaderboard_reward",
                amount: rewardPoints,
                date: Date.now(),
                description: `Rank #${index + 1} reward for ${monthLabel}`,
              },
            },
          }
        );
      }

      return {
        rank: index + 1,
        userId: entry._id,
        userName: user?.name || "Anonymous",
        totalSpend: Math.round(entry.totalSpend),
        rewardPoints,
      };
    })
  );

  // Save to history
  const historyEntry = new LeaderboardHistory({
    month: targetStart,
    monthLabel,
    winners,
  });
  await historyEntry.save();

  return { success: true, monthLabel, winners };
};

// Automatic archive - called by cron on 1st of each month
export const autoArchivePreviousMonth = async () => {
  try {
    const now = new Date();
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log(`[LEADERBOARD CRON] Auto-archiving: ${prevMonthStart.toLocaleString("default", { month: "long", year: "numeric" })}`);
    
    const result = await archiveMonthData(prevMonthStart, prevMonthEnd, true);

    if (result.alreadyArchived) {
      console.log(`[LEADERBOARD CRON] ${result.monthLabel} already archived, skipping.`);
    } else if (result.noData) {
      console.log(`[LEADERBOARD CRON] No orders found for ${result.monthLabel}, skipping.`);
    } else {
      console.log(`[LEADERBOARD CRON] Successfully archived ${result.monthLabel}:`, result.winners.map(w => `#${w.rank} ${w.userName} (₹${w.totalSpend})`).join(', '));
    }

    return result;
  } catch (err) {
    console.error("[LEADERBOARD CRON] Auto-archive error:", err.message);
  }
};

// POST /leaderboard/archive - Archive current month and distribute rewards (Admin only)
export const archiveMonth = async (req, res) => {
  try {
    const startOfMonth = getStartOfMonth();
    const endOfMonth = getEndOfMonth();

    const result = await archiveMonthData(startOfMonth, endOfMonth, true);

    if (result.alreadyArchived) {
      return res.status(400).json({ error: `${result.monthLabel} has already been archived` });
    }
    if (result.noData) {
      return res.status(400).json({ error: `No orders found for ${result.monthLabel}` });
    }

    res.status(200).json({
      message: `Successfully archived ${result.monthLabel} leaderboard`,
      winners: result.winners,
    });
  } catch (err) {
    console.error("[LEADERBOARD ARCHIVE] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST /leaderboard/recover - Recover/archive a past month (Admin only)
// Body: { year: 2026, month: 2, distributeRewards: false }
export const archivePastMonth = async (req, res) => {
  try {
    const { year, month, distributeRewards = false } = req.body;

    if (!year || !month) {
      return res.status(400).json({ error: "year and month are required (e.g., { year: 2026, month: 2 })" });
    }

    const targetStart = new Date(year, month - 1, 1); // month is 1-indexed from client
    const targetEnd = new Date(year, month, 1);

    const result = await archiveMonthData(targetStart, targetEnd, distributeRewards);

    if (result.alreadyArchived) {
      return res.status(400).json({ error: `${result.monthLabel} has already been archived` });
    }
    if (result.noData) {
      return res.status(400).json({ error: `No completed orders found for ${result.monthLabel}` });
    }

    res.status(200).json({
      message: `Successfully recovered ${result.monthLabel} leaderboard${distributeRewards ? ' (rewards distributed)' : ' (no rewards distributed)'}`,
      winners: result.winners,
    });
  } catch (err) {
    console.error("[LEADERBOARD RECOVER] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
