// backend/controllers/aiController.js
import dotenv from "dotenv";
import { routeRequest } from "../services/aiRouter.js";
import { cleanJsonResponse } from "../services/aiProviders.js";

dotenv.config();

export const generateResumeContent = async (req, res) => {
  try {
    const { name, title, role, experience, skills, education, projects, prompt, aiMode, task: requestedTask } = req.body;

    // Fallback defaults for safety
    const nameText = name || "The applicant";
    const roleText = role || title || "Professional candidate";
    const experienceText = Array.isArray(experience) ? experience.join(", ") : experience || "No experience provided";
    const skillsText = Array.isArray(skills) ? skills.join(", ") : skills || "Not specified";
    const educationText = Array.isArray(education) ? education.join(", ") : education || "Not specified";
    const projectsText = Array.isArray(projects) ? projects.join(", ") : projects || "Not specified";
    const userPrompt = prompt || "";

    // Build an adaptive prompt
    const finalPrompt = `
      You are an expert resume writer and career consultant.
      ${userPrompt ? `The user specifically requests: "${userPrompt}".` : ""}
      
      Based on the following candidate data, generate a **complete, ATS-optimized professional resume** in valid JSON format:
      
      Candidate details:
      - Name: ${nameText}
      - Role: ${roleText}
      - Skills: ${skillsText}
      - Experience: ${experienceText}
      - Education: ${educationText}
      - Projects: ${projectsText}

      Respond only with a **valid JSON object**, no markdown or comments.
      Use this structure exactly:

      {
        "summary": "Professional summary paragraph",
        "skills": ["Skill 1", "Skill 2", "Skill 3"],
        "experience": [
          {
            "title": "Job Title",
            "company": "Company Name",
            "duration": "Month Year - Month Year",
            "details": [
              "Achievement or responsibility 1",
              "Achievement or responsibility 2"
            ]
          }
        ],
        "education": [
          {
            "degree": "Degree Name",
            "institution": "University Name",
            "year": "Year"
          }
        ],
        "projects": [
          {
            "title": "Project Title",
            "description": "Short project description",
            "technologies": ["Tech 1", "Tech 2"]
          }
        ],
        "certifications": ["Certification 1", "Certification 2"]
      }
    `;

    // 1. Task inference
    let task = requestedTask;
    if (!task) {
      const promptLower = userPrompt.toLowerCase();
      if (promptLower.includes("bullet") || promptLower.includes("rewrite") || promptLower.includes("achievement")) {
        task = "experience_rewrite";
      } else if (promptLower.includes("skill") || promptLower.includes("keyword") || promptLower.includes("suggest")) {
        task = "skill_suggestions";
      } else if (promptLower.includes("project") || promptLower.includes("description")) {
        task = "project_description";
      } else {
        task = "resume_summary";
      }
    }

    const mode = aiMode || "balanced";

    // If only title is passed (e.g. CreateResumeForm direct generation), build a simpler prompt
    const promptToUse = (title && !prompt && !experience && !skills)
      ? `Generate a starter resume JSON structure for a candidate with the title "${title}". Respond ONLY with valid JSON structure.`
      : finalPrompt;

    // 2. Execute via multi-model router
    const { text, metadata } = await routeRequest(task, promptToUse, mode);

    // Try to clean and parse JSON safely
    let jsonResponse;
    try {
      const cleaned = cleanJsonResponse(text);
      jsonResponse = JSON.parse(cleaned);
    } catch (err) {
      console.warn("⚠️ Could not parse JSON output. Sending raw text instead.");
      jsonResponse = { raw: text };
    }

    res.json({
      success: true,
      aiResume: jsonResponse,
      metadata
    });
  } catch (error) {
    console.error("❌ AI Generation Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "AI generation failed.",
    });
  }
};

