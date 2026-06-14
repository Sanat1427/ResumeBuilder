import dotenv from "dotenv";
import { routeRequest } from "../services/aiRouter.js";
import { cleanJsonResponse } from "../services/aiProviders.js";

dotenv.config();

export const analyzeResumeAI = async (req, res) => {
  try {
    const { resumeData, aiMode, task: requestedTask } = req.body;
    const task = requestedTask || "ats_analysis";
    const mode = aiMode || "balanced";

    const prompt = `
      You are an expert career coach. Analyze this resume and give structured, actionable feedback.
      Respond in JSON with these keys:
      {
        "strengths": ["Strong point 1", "Strong point 2"],
        "weaknesses": ["Weak point 1", "Weak point 2"],
        "suggestions": ["Improvement 1", "Improvement 2"],
        "toneSummary": "Overall tone and impression of the resume"
      }

      Resume Data:
      ${JSON.stringify(resumeData, null, 2)}
    `;

    const { text, metadata } = await routeRequest(task, prompt, mode);

    let analysis;
    try {
      const cleaned = cleanJsonResponse(text);
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = { raw: text };
    }

    res.json({ success: true, analysis, metadata });
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

