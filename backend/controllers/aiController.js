// backend/controllers/aiController.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateResumeContent = async (req, res) => {
  try {
    const { name, title, role, experience, skills, education, projects, prompt } = req.body;

    // Fallback defaults for safety
    const nameText = name || "The applicant";
    const roleText = role || title || "Professional candidate";
    const experienceText = Array.isArray(experience) ? experience.join(", ") : experience || "No experience provided";
    const skillsText = Array.isArray(skills) ? skills.join(", ") : skills || "Not specified";
    const educationText = Array.isArray(education) ? education.join(", ") : education || "Not specified";
    const projectsText = Array.isArray(projects) ? projects.join(", ") : projects || "Not specified";
    const userPrompt = prompt || "";

    // Build an adaptive prompt for Gemini
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

    // ✅ Use Gemini 2.5 Flash for the latest structured model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(finalPrompt);
    const text = result.response.text();

    // Try to clean and parse JSON safely
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (err) {
      console.warn("⚠️ Could not parse JSON output. Sending raw text instead.");
      jsonResponse = { raw: text };
    }

    res.json({
      success: true,
      aiResume: jsonResponse,
    });
  } catch (error) {
    console.error("❌ AI Generation Error:", error.message);
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "AI generation failed. Please verify your Gemini API key or model name.",
    });
  }
};
