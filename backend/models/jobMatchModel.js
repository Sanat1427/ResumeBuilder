import mongoose from "mongoose";

const JobMatchSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      default: "",
    },
    matchScore: {
      type: Number,
      required: true,
    },
    keywordMatch: {
      type: Number,
      required: true,
    },
    skillsMatch: {
      type: Number,
      required: true,
    },
    experienceMatch: {
      type: Number,
      required: true,
    },
    educationMatch: {
      type: Number,
      required: true,
    },
    matchedKeywords: [
      {
        type: String,
      }
    ],
    missingKeywords: [
      {
        type: String,
      }
    ],
    suggestions: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        action: {
          type: { type: String, required: true },
          payload: { type: mongoose.Schema.Types.Mixed, required: true }
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("JobMatch", JobMatchSchema);
