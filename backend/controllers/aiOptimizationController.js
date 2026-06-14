import ResumeParserService from "../services/ResumeParserService.js";
import JDMatchingService from "../services/JDMatchingService.js";
import ResumeReviewService from "../services/ResumeReviewService.js";
import Resume from "../models/resumeModels.js";
import JobMatch from "../models/jobMatchModel.js";
import AIReview from "../models/aiReviewModel.js";
import ResumeScore from "../models/resumeScoreModel.js";

/**
 * Handle document file upload and AI resume parsing
 */
export const importResumeFile = async (req, res) => {
  console.log("Upload Received");
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        stage: "upload",
        error: "400 Bad Request",
        message: "400 Bad Request: No file uploaded"
      });
    }

    const userId = req.user._id;
    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname;

    const result = await ResumeParserService.parseResumeFile(userId, buffer, mimeType, originalName);
    
    if (result && result.success === false) {
      console.error(`Import failed at stage [${result.stage}]:`, result.error);
      return res.status(400).json(result);
    }

    console.log("Resume Imported");
    res.json(result);
  } catch (error) {
    console.error("Resume file import controller error:", error);
    res.status(500).json({
      success: false,
      stage: "unknown",
      error: error.message,
      message: error.message
    });
  }
};

/**
 * Compare resume data against pasted job description
 */
export const analyzeJobMatch = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription) {
      return res.status(400).json({ success: false, message: "Missing resumeId or jobDescription" });
    }

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(403).json({ success: false, message: "Unauthorized resume access" });
    }

    const matchResults = await JDMatchingService.matchResumeToJD(resumeId, jobDescription);
    res.json({ success: true, ...matchResults });
  } catch (error) {
    console.error("JD Match controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Perform a full audit score and actionable items review
 */
export const auditResume = async (req, res) => {
  try {
    const { resumeId } = req.body;
    if (!resumeId) {
      return res.status(400).json({ success: false, message: "Missing resumeId" });
    }

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(403).json({ success: false, message: "Unauthorized resume access" });
    }

    const reviewResults = await ResumeReviewService.reviewResume(resumeId);
    res.json({ success: true, ...reviewResults });
  } catch (error) {
    console.error("Resume review controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Aggregate stats and scores history for the logged-in user
 */
export const getUserPlacementAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all resumes owned by the user
    const userResumes = await Resume.find({ userId }).select("_id title template");
    const resumeIds = userResumes.map(r => r._id);

    const totalResumes = userResumes.length;

    // Aggregate counts
    const jdMatchesCount = await JobMatch.countDocuments({ resumeId: { $in: resumeIds } });
    const aiReviewsCount = await AIReview.countDocuments({ resumeId: { $in: resumeIds } });

    // Score trends (aggregate chronological scores)
    const scoreLogs = await ResumeScore.find({ resumeId: { $in: resumeIds } })
      .sort({ createdAt: 1 })
      .limit(30)
      .select("score createdAt resumeId");

    const scoreTrend = scoreLogs.map(log => {
      const parentResume = userResumes.find(r => r._id.toString() === log.resumeId.toString());
      return {
        score: log.score,
        date: log.createdAt,
        resumeTitle: parentResume ? parentResume.title : "Resume"
      };
    });

    // Suggestion statistics
    const completedReviews = await AIReview.find({ resumeId: { $in: resumeIds } });
    let suggestionsApplied = 0;
    completedReviews.forEach(rev => {
      suggestionsApplied += (rev.suggestions || []).filter(s => s.status === "applied").length;
    });

    // Template usage statistics
    const templateCounts = {};
    userResumes.forEach(r => {
      const themeId = r.template?.theme || "ats-classic";
      templateCounts[themeId] = (templateCounts[themeId] || 0) + 1;
    });

    res.json({
      success: true,
      analytics: {
        totalResumes,
        jdMatchesCount,
        aiReviewsCount,
        suggestionsApplied,
        scoreTrend,
        templateCounts
      }
    });
  } catch (error) {
    console.error("Fetch analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
