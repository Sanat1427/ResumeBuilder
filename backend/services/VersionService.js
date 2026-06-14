import ResumeVersion from "../models/resumeVersionModel.js";
import Resume from "../models/resumeModels.js";

class VersionService {
  /**
   * Create a new snapshot version of a resume
   */
  async createSnapshot(resumeId, label = "") {
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Find the next version number
    const lastVersion = await ResumeVersion.findOne({ resumeId }).sort({ versionNumber: -1 });
    const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

    const snapshot = await ResumeVersion.create({
      resumeId,
      versionNumber: nextVersionNumber,
      resumeData: {
        title: resume.title,
        profileInfo: resume.profileInfo,
        contactInfo: resume.contactInfo,
        workExperience: resume.workExperience,
        education: resume.education,
        skills: resume.skills,
        projects: resume.projects,
        certifications: resume.certifications,
        languages: resume.languages,
        interests: resume.interests
      },
      themeConfig: {
        theme: resume.template?.theme || "01",
        primaryColor: resume.template?.primaryColor || "#000000",
        accentColor: resume.template?.accentColor || "#ffe17c",
        fontFamily: resume.template?.fontFamily || "'Inter', sans-serif",
        layout: resume.template?.layout || "modern"
      },
      label: label || `Snapshot Version ${nextVersionNumber}`
    });

    return snapshot;
  }

  /**
   * List all versions of a resume
   */
  async listVersions(resumeId) {
    return ResumeVersion.find({ resumeId }).sort({ versionNumber: -1 }).select("-resumeData");
  }

  /**
   * Restore a resume to a previous snapshot
   */
  async restoreSnapshot(resumeId, versionId) {
    const version = await ResumeVersion.findOne({ _id: versionId, resumeId });
    if (!version) {
      throw new Error("Snapshot version not found");
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      throw new Error("Resume not found");
    }

    // Overwrite fields
    const rd = version.resumeData;
    resume.title = rd.title;
    resume.profileInfo = rd.profileInfo;
    resume.contactInfo = rd.contactInfo;
    resume.workExperience = rd.workExperience;
    resume.education = rd.education;
    resume.skills = rd.skills;
    resume.projects = rd.projects;
    resume.certifications = rd.certifications;
    resume.languages = rd.languages;
    resume.interests = rd.interests;

    // Overwrite template details
    if (version.themeConfig) {
      resume.template = {
        theme: version.themeConfig.theme,
        primaryColor: version.themeConfig.primaryColor,
        accentColor: version.themeConfig.accentColor,
        fontFamily: version.themeConfig.fontFamily,
        layout: version.themeConfig.layout
      };
    }

    await resume.save();
    return resume;
  }

  /**
   * Compare two versions of a resume structure
   */
  async compareSnapshots(resumeId, versionAId, versionBId) {
    const vA = await ResumeVersion.findOne({ _id: versionAId, resumeId });
    const vB = await ResumeVersion.findOne({ _id: versionBId, resumeId });

    if (!vA || !vB) {
      throw new Error("One or both snapshots could not be found");
    }

    const dataA = vA.resumeData;
    const dataB = vB.resumeData;

    // Structural diff comparison
    const diff = {
      summary: {
        oldVal: dataA.profileInfo?.summary || "",
        newVal: dataB.profileInfo?.summary || ""
      },
      skills: this.diffArrays(
        (dataA.skills || []).map(s => s.name),
        (dataB.skills || []).map(s => s.name)
      ),
      experience: this.diffExperience(dataA.workExperience || [], dataB.workExperience || []),
      projects: this.diffProjects(dataA.projects || [], dataB.projects || [])
    };

    return {
      versionA: { id: vA._id, number: vA.versionNumber, label: vA.label },
      versionB: { id: vB._id, number: vB.versionNumber, label: vB.label },
      diff
    };
  }

  diffArrays(arrA, arrB) {
    const setA = new Set(arrA.filter(Boolean));
    const setB = new Set(arrB.filter(Boolean));

    const added = [...setB].filter(x => !setA.has(x));
    const removed = [...setA].filter(x => !setB.has(x));

    return { added, removed };
  }

  diffExperience(expA, expB) {
    const diffs = [];
    const maxLength = Math.max(expA.length, expB.length);

    for (let i = 0; i < maxLength; i++) {
      const itemA = expA[i] || {};
      const itemB = expB[i] || {};

      if (
        itemA.company !== itemB.company ||
        itemA.role !== itemB.role ||
        itemA.description !== itemB.description
      ) {
        diffs.push({
          index: i,
          company: itemB.company || itemA.company || "Unknown Company",
          role: itemB.role || itemA.role || "Unknown Role",
          oldDesc: itemA.description || "",
          newDesc: itemB.description || ""
        });
      }
    }

    return diffs;
  }

  diffProjects(projA, projB) {
    const diffs = [];
    const maxLength = Math.max(projA.length, projB.length);

    for (let i = 0; i < maxLength; i++) {
      const itemA = projA[i] || {};
      const itemB = projB[i] || {};

      if (
        itemA.title !== itemB.title ||
        itemA.description !== itemB.description
      ) {
        diffs.push({
          index: i,
          title: itemB.title || itemA.title || "Untitled Project",
          oldDesc: itemA.description || "",
          newDesc: itemB.description || ""
        });
      }
    }

    return diffs;
  }
}

export default new VersionService();
