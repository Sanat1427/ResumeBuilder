import mongoose from "mongoose";

const ResumeScoreSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    missingItems: [
      {
        type: String,
      }
    ],
    suggestions: [
      {
        type: String,
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ResumeScore", ResumeScoreSchema);
