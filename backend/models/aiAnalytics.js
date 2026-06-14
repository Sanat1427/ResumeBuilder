import mongoose from "mongoose";

const AIAnalyticsSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AIAnalytics", AIAnalyticsSchema);
