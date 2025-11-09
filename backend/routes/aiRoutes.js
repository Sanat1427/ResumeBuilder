import express from "express";
import { generateResumeContent } from "../controllers/aiController.js";
import { analyzeResumeAI } from "../controllers/aiAnalyzeController.js";
const router = express.Router();

router.post("/generate", generateResumeContent);
router.post("/analyze", analyzeResumeAI);
export default router;
