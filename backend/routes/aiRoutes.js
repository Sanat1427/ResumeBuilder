import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { generateResumeContent } from "../controllers/aiController.js";
import { analyzeResumeAI } from "../controllers/aiAnalyzeController.js";
import {
  importResumeFile,
  analyzeJobMatch,
  auditResume,
  getUserPlacementAnalytics
} from "../controllers/aiOptimizationController.js";
import AIAnalytics from "../models/aiAnalytics.js";

const router = express.Router();

// Multer in-memory storage config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Original legacy routes
router.post("/generate", protect, rateLimiter(30), generateResumeContent);
router.post("/analyze", protect, rateLimiter(30), analyzeResumeAI);

// Placement Upgrade routes
router.post("/import", protect, rateLimiter(10), upload.single("resumeFile"), importResumeFile);
router.post("/match-jd", protect, rateLimiter(20), analyzeJobMatch);
router.post("/review", protect, rateLimiter(20), auditResume);
router.get("/user-analytics", protect, rateLimiter(30), getUserPlacementAnalytics);

// Legacy stats logger dashboard API
router.get("/analytics", protect, rateLimiter(30), async (req, res) => {
  try {
    const stats = await AIAnalytics.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          success: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
          failure: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
          avgResponseTime: { $avg: "$responseTime" }
        }
      }
    ]);

    const modelStats = await AIAnalytics.aggregate([
      {
        $group: {
          _id: "$modelName",
          provider: { $first: "$provider" },
          total: { $sum: 1 },
          success: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
          avgResponseTime: { $avg: { $cond: [{ $eq: ["$status", "success"] }, "$responseTime", null] } }
        }
      }
    ]);

    const taskStats = await AIAnalytics.aggregate([
      {
        $group: {
          _id: "$task",
          total: { $sum: 1 },
          success: { $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } },
          avgResponseTime: { $avg: { $cond: [{ $eq: ["$status", "success"] }, "$responseTime", null] } }
        }
      }
    ]);

    const recentLogs = await AIAnalytics.find().sort({ createdAt: -1 }).limit(20);

    res.json({
      success: true,
      summary: stats[0] || { total: 0, success: 0, failure: 0, avgResponseTime: 0 },
      models: modelStats,
      tasks: taskStats,
      recent: recentLogs
    });
  } catch (error) {
    console.error("Fetch analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
