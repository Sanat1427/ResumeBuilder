import mongoose from "mongoose";

const ResumeVersionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    resumeData: {
      type: Object,
      required: true,
    },
    themeConfig: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of version number per resume
ResumeVersionSchema.index({ resumeId: 1, versionNumber: 1 }, { unique: true });

export default mongoose.model("ResumeVersion", ResumeVersionSchema);
