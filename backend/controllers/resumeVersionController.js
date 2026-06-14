import VersionService from "../services/VersionService.js";
import Resume from "../models/resumeModels.js";

/**
 * Capture a new snapshot version for a resume
 */
export const saveSnapshot = async (req, res) => {
  try {
    const { resumeId, label } = req.body;
    if (!resumeId) {
      return res.status(400).json({ success: false, message: "Missing resumeId" });
    }

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(403).json({ success: false, message: "Unauthorized resume access" });
    }

    const snapshot = await VersionService.createSnapshot(resumeId, label);
    res.status(201).json({ success: true, snapshot });
  } catch (error) {
    console.error("Save snapshot controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * List all saved snapshot versions for a resume
 */
export const listSnapshots = async (req, res) => {
  try {
    const { id: resumeId } = req.params;

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(403).json({ success: false, message: "Unauthorized resume access" });
    }

    const versions = await VersionService.listVersions(resumeId);
    res.json({ success: true, versions });
  } catch (error) {
    console.error("List snapshots controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Restore resume state to a specific snapshot
 */
export const restoreSnapshot = async (req, res) => {
  try {
    const { resumeId, versionId } = req.body;
    if (!resumeId || !versionId) {
      return res.status(400).json({ success: false, message: "Missing resumeId or versionId" });
    }

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(403).json({ success: false, message: "Unauthorized resume access" });
    }

    const updatedResume = await VersionService.restoreSnapshot(resumeId, versionId);
    res.json({ success: true, resume: updatedResume, message: "Resume successfully restored to selected snapshot version." });
  } catch (error) {
    console.error("Restore snapshot controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Compare two snapshot versions
 */
export const compareSnapshots = async (req, res) => {
  try {
    const { resumeId, versionAId, versionBId } = req.query;
    if (!resumeId || !versionAId || !versionBId) {
      return res.status(400).json({ success: false, message: "Missing query parameters: resumeId, versionAId, versionBId" });
    }

    // Verify ownership
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) {
      return res.status(403).json({ success: false, message: "Unauthorized resume access" });
    }

    const comparison = await VersionService.compareSnapshots(resumeId, versionAId, versionBId);
    res.json({ success: true, comparison });
  } catch (error) {
    console.error("Compare snapshots controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
