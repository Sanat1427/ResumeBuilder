import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import {
  createResume,
  deleteResume,
  getResumeById,
  getUserResume,
  updateResume
} from "../controllers/resumeController.js";
import {
  saveSnapshot,
  listSnapshots,
  restoreSnapshot,
  compareSnapshots
} from "../controllers/resumeVersionController.js";

const resumeRouter = express.Router();

// Core resume builder CRUD
resumeRouter.post("/", protect, rateLimiter(20), createResume);
resumeRouter.get("/", protect, rateLimiter(30), getUserResume);
resumeRouter.get("/:id", protect, rateLimiter(35), getResumeById);
resumeRouter.put("/:id", protect, rateLimiter(25), updateResume);
resumeRouter.delete("/:id", protect, rateLimiter(15), deleteResume);

// Version history snapshot controls
resumeRouter.post("/versions", protect, rateLimiter(20), saveSnapshot);
resumeRouter.get("/:id/versions", protect, rateLimiter(30), listSnapshots);
resumeRouter.post("/versions/restore", protect, rateLimiter(20), restoreSnapshot);
resumeRouter.get("/versions/compare", protect, rateLimiter(30), compareSnapshots);

export default resumeRouter;
