// testGemini.js
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from .env file
dotenv.config();

async function run() {
  try {
    console.log("🧠 Testing Gemini direct call...");
    
    // 1. Initialize the generative AI client
    // Make sure 'GEMINI_API_KEY' is the exact name of the variable in your .env file
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 2. Get the model using the correct name for Google AI Studio
   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Define your prompt
    const prompt = "Hello, world!"; // Or any test prompt

    // 4. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini test successful!");
    console.log(text);

  } catch (error) {
    console.error("❌ Direct Gemini test error:", error);
    
    // Add specific advice for common errors
    if (error.status === 404) {
        console.error("\n💡 HINT: A 404 error still means the model name might be wrong or your key doesn't have access.");
    }
    if (error.message.includes("API key not valid")) {
        console.error("\n💡 HINT: Check your .env file. Is the GEMINI_API_KEY correct?");
    }
  }
}

run();