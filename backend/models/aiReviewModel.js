import mongoose from "mongoose";

const AIReviewSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
    },
    categories: {
      contentQuality: { type: Number, required: true },
      projectQuality: { type: Number, required: true },
      keywordOptimization: { type: Number, required: true },
      atsReadiness: { type: Number, required: true },
      completeness: { type: Number, required: true },
      formatting: { type: Number, required: true }
    },
    suggestions: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        section: { type: String, required: true }, // e.g. "summary", "experience", "projects", "skills"
        status: {
          type: String,
          enum: ["pending", "applied", "ignored"],
          default: "pending"
        },
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

export default mongoose.model("AIReview", AIReviewSchema);
