import mongoose from "mongoose";

const ResumeImportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    confidenceScores: {
      profileInfo: { type: Number, default: 0 },
      contactInfo: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      workExperience: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      certifications: { type: Number, default: 0 },
      languages: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ResumeImport", ResumeImportSchema);
