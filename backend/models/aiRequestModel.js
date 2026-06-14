import mongoose from "mongoose";

const AIRequestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      required: true,
    },
    latency: {
      type: Number,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      default: null,
    },
    tokenUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AIRequest", AIRequestSchema);
