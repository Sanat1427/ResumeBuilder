import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResumeAI = async (req, res) => {
  try {
    const { resumeData } = req.body;

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let analysis;
    try {
      analysis = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      analysis = { raw: text };
    }

    res.json({ success: true, analysis });
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
