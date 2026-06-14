import Resume from "../models/resumeModels.js";
import AIReview from "../models/aiReviewModel.js";
import ResumeScore from "../models/resumeScoreModel.js";
import { routeRequest } from "./AIRouterService.js";
import { cleanJsonResponse } from "./ProviderService.js";
import cacheService from "./cacheService.js";
import crypto from "crypto";

class ResumeReviewService {
  /**
   * Conduct a full review of a resume
   */
  async reviewResume(resumeId) {
    // 1. Fetch Resume data first to calculate content hash
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

    // Calculate content hash of the resume data to build the cache key
    const resumeContentString = JSON.stringify(optimizedResumeData);
    const resumeHash = crypto.createHash("sha256").update(resumeContentString).digest("hex");
    const cacheKey = `resume_review_${resumeId}_${resumeHash}`;

    // Check in-memory cache
    const cachedResult = cacheService.get(cacheKey);
    if (cachedResult) {
      console.log(`[Cache Hit] Serving resume review for resume ${resumeId}`);
      return cachedResult;
    }

    // 2. Prepare AI prompt
    const prompt = `
      You are a professional resume writer and career coach. Review this resume and generate a detailed audit score (overall and category breakdowns), along with structured optimization suggestions.

      Resume Data:
      ${JSON.stringify(optimizedResumeData, null, 2)}


      Evaluate the resume on:
      1. ATS Compatibility (is the layout and naming conventions scanner friendly?)
      2. Content Strength (do experience bullets use strong verbs?)
      3. Project Quality (do projects show impact?)
      4. Keyword Optimization (are key technical elements represented?)
      5. Formatting (dates and location structured?)
      6. Completeness (all contact details present?)

      Respond ONLY with a JSON object containing this structure:
      {
        "overallScore": 87,
        "categories": {
          "contentQuality": 82,
          "projectQuality": 90,
          "keywordOptimization": 80,
          "atsReadiness": 85,
          "completeness": 90,
          "formatting": 95
        },
        "suggestions": [
          {
            "id": "rev-sug-1",
            "text": "Add missing industry keyword 'Docker' to your technical skills.",
            "section": "skills",
            "action": {
              "type": "add_skill",
              "payload": { "name": "Docker", "progress": 80 }
            }
          },
          {
            "id": "rev-sug-2",
            "text": "Quantify your achievements in your latest role by adding metrics.",
            "section": "experience",
            "action": {
              "type": "append_experience_bullet",
              "payload": { "index": 0, "text": "Boosted frontend application load speeds by 25% by implementing lazy loading and code splitting." }
            }
          }
        ]
      }

      Respond ONLY with valid JSON. Do not include markdown code block formats.
    `;

    try {
      const { text } = await routeRequest("resume_review", prompt);
      const cleaned = cleanJsonResponse(text);
      const review = JSON.parse(cleaned);

      // Validate scores
      review.overallScore = Number(review.overallScore) || 70;
      if (!review.categories) {
        review.categories = {
          contentQuality: 70,
          projectQuality: 70,
          keywordOptimization: 70,
          atsReadiness: 70,
          completeness: 70,
          formatting: 70
        };
      }

      // Save to database Review log
      const savedReview = await AIReview.create({
        resumeId,
        overallScore: review.overallScore,
        categories: {
          contentQuality: Number(review.categories.contentQuality) || 70,
          projectQuality: Number(review.categories.projectQuality) || 70,
          keywordOptimization: Number(review.categories.keywordOptimization) || 70,
          atsReadiness: Number(review.categories.atsReadiness) || 70,
          completeness: Number(review.categories.completeness) || 70,
          formatting: Number(review.categories.formatting) || 70
        },
        suggestions: review.suggestions || []
      });

      // Save to ResumeScore collection to maintain scoring trend logs
      const missingItemsList = (review.suggestions || []).map(s => s.text);
      await ResumeScore.create({
        resumeId,
        score: review.overallScore,
        missingItems: missingItemsList,
        suggestions: missingItemsList
      });

      const responsePayload = {
        ...review,
        _id: savedReview._id
      };

      // Cache the result for 10 minutes
      cacheService.set(cacheKey, responsePayload, 600000);

      return responsePayload;
    } catch (err) {
      console.error("Resume review failed:", err);
      throw new Error(`Resume Auditor error: ${err.message}`);
    }
  }
}

export default new ResumeReviewService();
