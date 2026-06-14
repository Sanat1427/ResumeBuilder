import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance = null;
const getGeminiClient = () => {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes a function with automatic retries and exponential backoff
 */
const executeWithRetry = async (apiCallFn, retries = 3, initialDelayMs = 1000) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await apiCallFn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw error;
      }
      const delay = initialDelayMs * Math.pow(2, attempt);
      console.warn(`[AI Provider Retry] Attempt ${attempt} failed. Retrying in ${delay}ms... Error: ${error.message}`);
      await wait(delay);
    }
  }
};

/**
 * Calls Gemini Generative Model with retries
 */
export const callGemini = async (modelName, prompt) => {
  return executeWithRetry(async () => {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error("Empty response returned from Gemini API");
    }
    
    return result.response.text();
  });
};

/**
 * Calls Groq chat completion endpoint with retries
 */
export const callGroq = async (modelName, prompt) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from environment variables.");
  }

  return executeWithRetry(async () => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq API returned status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Groq API returned an empty choices array.");
    }

    return data.choices[0].message.content;
  });
};

/**
 * Strip Markdown code formatting indicators from JSON outputs
 */
export const cleanJsonResponse = (text) => {
  if (!text) return "";
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "");
    cleaned = cleaned.replace(/\n?```$/i, "");
  }
  return cleaned.trim();
};
