import { callGemini, callGroq } from "./ProviderService.js";
import AIRequest from "../models/aiRequestModel.js";
import AIAnalytics from "../models/aiAnalytics.js";
import requestQueue from "./queueService.js";

export const PROVIDERS = {
  GEMINI: "Google Gemini",
  GROQ: "Groq"
};

export const MODELS = {
  GEMINI_FLASH: { provider: PROVIDERS.GEMINI, id: "gemini-2.5-flash" },
  GROQ_LLAMA: { provider: PROVIDERS.GROQ, id: "llama-3.3-70b-versatile" },
  GROQ_QWEN: { provider: PROVIDERS.GROQ, id: "qwen/qwen3-32b" },
  GROQ_DEEPSEEK: { provider: PROVIDERS.GROQ, id: "deepseek-r1-distill-llama-70b" }
};

/**
 * Get fallback model list based on the requested task
 */
export const getFallbackChain = (task) => {
  const t = (task || "").toLowerCase();

  if (t === "resume_summary") {
    return [MODELS.GEMINI_FLASH, MODELS.GROQ_LLAMA, MODELS.GROQ_QWEN];
  }
  if (t === "experience_rewrite" || t === "project_description") {
    return [MODELS.GEMINI_FLASH, MODELS.GROQ_LLAMA, MODELS.GROQ_QWEN];
  }
  if (t === "ats_analysis") {
    return [MODELS.GROQ_LLAMA, MODELS.GROQ_DEEPSEEK, MODELS.GEMINI_FLASH];
  }
  if (t === "keyword_extraction") {
    return [MODELS.GROQ_QWEN, MODELS.GROQ_LLAMA, MODELS.GEMINI_FLASH];
  }
  if (t === "skill_suggestions") {
    return [MODELS.GROQ_LLAMA, MODELS.GROQ_QWEN, MODELS.GEMINI_FLASH];
  }
  if (t === "resume_review") {
    return [MODELS.GEMINI_FLASH, MODELS.GROQ_LLAMA, MODELS.GROQ_DEEPSEEK];
  }
  if (t === "jd_matching") {
    // Priority: Gemini Flash + Groq Llama/DeepSeek
    return [MODELS.GEMINI_FLASH, MODELS.GROQ_LLAMA, MODELS.GROQ_DEEPSEEK];
  }

  // Default fallback
  return [MODELS.GEMINI_FLASH, MODELS.GROQ_LLAMA, MODELS.GROQ_QWEN];
};

/**
 * Route request through the fallback chain, queued under requestQueue to control rate limits
 */
export const routeRequest = async (task, prompt) => {
  return requestQueue.enqueue(async () => {
    const chain = getFallbackChain(task);
    const errors = [];

    for (const modelConfig of chain) {
      const startTime = performance.now();
      try {
        let responseText;
        if (modelConfig.provider === PROVIDERS.GEMINI) {
          responseText = await callGemini(modelConfig.id, prompt);
        } else if (modelConfig.provider === PROVIDERS.GROQ) {
          responseText = await callGroq(modelConfig.id, prompt);
        } else {
          throw new Error(`Unsupported provider: ${modelConfig.provider}`);
        }

        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);

        // Async write request logs to DB for analytics
        AIRequest.create({
          requestType: task,
          latency,
          success: true,
          provider: modelConfig.provider,
          model: modelConfig.id,
          tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } // simulated for free-tier
        }).catch((err) => console.error("Failed logging AI request details:", err.message));

        // Legacy support logging
        AIAnalytics.create({
          task,
          mode: "balanced",
          provider: modelConfig.provider,
          modelName: modelConfig.id,
          responseTime: latency,
          status: "success"
        }).catch(() => {});

        return {
          text: responseText,
          metadata: {
            provider: modelConfig.provider,
            model: modelConfig.id,
            latency
          }
        };
      } catch (err) {
        const endTime = performance.now();
        const latency = Math.round(endTime - startTime);
        const errorMsg = err.message || "Unknown error";

        console.warn(`[Failover Routing] Model ${modelConfig.provider}/${modelConfig.id} failed: ${errorMsg}`);
        
        // Log request failure
        AIRequest.create({
          requestType: task,
          latency,
          success: false,
          provider: modelConfig.provider,
          model: modelConfig.id,
          error: errorMsg
        }).catch(() => {});

        AIAnalytics.create({
          task,
          mode: "balanced",
          provider: modelConfig.provider,
          modelName: modelConfig.id,
          responseTime: latency,
          status: "failed",
          error: errorMsg
        }).catch(() => {});

        errors.push({ model: modelConfig.id, error: errorMsg });
      }
    }

    throw new Error(`All models failed for task '${task}'. Failover logs: ${JSON.stringify(errors)}`);
  });
};
