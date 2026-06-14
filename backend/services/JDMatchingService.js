import Resume from "../models/resumeModels.js";
import JobMatch from "../models/jobMatchModel.js";
import { routeRequest } from "./AIRouterService.js";
import { cleanJsonResponse } from "./ProviderService.js";
import cacheService from "./cacheService.js";
import crypto from "crypto";

class JDMatchingService {
  /**
   * Compare a resume against a Job Description
   */
  async matchResumeToJD(resumeId, jobDescription) {
    // 1. Fetch Resume data from database first to calculate content hash
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Prepare optimized resume data for prompt and hashing (Do not send template/theme/UI metadata)
    const optimizedResumeData = {
      summary: resume.profileInfo?.summary || "",
      experience: resume.workExperience || [],
      projects: resume.projects || [],
      skills: resume.skills || [],
      education: resume.education || []
    };

    // Calculate content hash of the resume and job description to build the cache key
    const resumeContentString = JSON.stringify(optimizedResumeData);
    const resumeHash = crypto.createHash("sha256").update(resumeContentString).digest("hex");
    const jdHash = crypto.createHash("sha256").update(jobDescription || "").digest("hex");
    const cacheKey = `jd_match_${resumeId}_${resumeHash}_${jdHash}`;

    // Check in-memory cache first to optimize cost and latency
    const cachedResult = cacheService.get(cacheKey);
    if (cachedResult) {
      console.log(`[Cache Hit] Serving JD match analysis for resume ${resumeId}`);
      return cachedResult;
    }

    // 2. Prepare AI comparison prompt
    const prompt = `
      You are an expert recruitment ATS system. Analyze the following candidate resume data against the job description provided.
      
      Resume Data:
      ${JSON.stringify(optimizedResumeData, null, 2)}

      Job Description:
      ---
      ${jobDescription}
      ---

      Based on this data, return a JSON object with:
      1. matchScore (Number: 0 to 100) - Overall rating
      2. keywordMatch (Number: 0 to 100)
      3. skillsMatch (Number: 0 to 100)
      4. experienceMatch (Number: 0 to 100)
      5. educationMatch (Number: 0 to 100)
      6. matchedKeywords (Array of Strings) - Keywords mentioned in both
      7. missingKeywords (Array of Strings) - High-priority keywords mentioned in JD but missing in Resume
      8. suggestions (Array of Objects) - Up to 4 actionable suggestions to optimize the resume for this JD.
         Each suggestion must have:
         - id: Unique string (e.g. "jd-sug-1")
         - text: A detailed text suggestion advising the user (e.g. "Add Docker experience...")
         - action: An object specifying how to automate this improvement on the frontend:
           - type: One of "add_skill", "append_experience_bullet", "update_summary", "update_project_description"
           - payload: The exact data to insert:
             - If type is "add_skill": { "name": "Skill Name", "progress": 85 }
             - If type is "append_experience_bullet": { "index": 0, "text": "Designed and implemented automated CI/CD pipelines to streamline deployment." }
             - If type is "update_summary": "Highly motivated Full Stack Engineer with experience building... and containerizing services using Docker."
             - If type is "update_project_description": { "index": 0, "value": "Developed a secure REST API with Node.js and MongoDB, containerized via Docker for reliable deployment." }

      Respond ONLY with valid JSON. Do not include markdown code block formats.
    `;

    try {
      const { text } = await routeRequest("jd_matching", prompt);
      const cleaned = cleanJsonResponse(text);
      const analysis = JSON.parse(cleaned);

      // Validate scores
      analysis.matchScore = Number(analysis.matchScore) || 50;
      analysis.keywordMatch = Number(analysis.keywordMatch) || 50;
      analysis.skillsMatch = Number(analysis.skillsMatch) || 50;
      analysis.experienceMatch = Number(analysis.experienceMatch) || 50;
      analysis.educationMatch = Number(analysis.educationMatch) || 50;

      // Save to database
      const savedMatch = await JobMatch.create({
        resumeId,
        jobDescription,
        matchScore: analysis.matchScore,
        keywordMatch: analysis.keywordMatch,
        skillsMatch: analysis.skillsMatch,
        experienceMatch: analysis.experienceMatch,
        educationMatch: analysis.educationMatch,
        matchedKeywords: analysis.matchedKeywords || [],
        missingKeywords: analysis.missingKeywords || [],
        suggestions: analysis.suggestions || []
      });

      const responsePayload = {
        ...analysis,
        _id: savedMatch._id
      };

      // Store in cache for 10 minutes
      cacheService.set(cacheKey, responsePayload, 600000);

      return responsePayload;
    } catch (err) {
      console.error("JD matching failed:", err);
      throw new Error(`Job Description Matching error: ${err.message}`);
    }
  }
}

export default new JDMatchingService();
