// check_models.js
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Access the ModelService directly to list available models
    const modelResponse = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; // Hack to ensure client is init
    
    // We need to use the underlying admin API to list models, 
    // which isn't always perfectly exposed in the simplified SDK.
    // Let's try a different approach that is sure to work with standard keys:
    // We will just try the most standard, older model that ALMOST ALWAYS works.
    
    console.log("🔍 Testing standard model names...");
    
    const modelsToTest = [
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro-001",
        "gemini-pro"
    ];

    for (const modelName of modelsToTest) {
        process.stdout.write(`Testing '${modelName}'... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            await model.generateContent("Hi");
            console.log("✅ WORKING!");
            console.log(`\n🎉 PLEASE USE THIS MODEL NAME IN YOUR CODE: "${modelName}"\n`);
            return; // Exit after finding the first working one
        } catch (e) {
             if (e.message.includes("404")) {
                 console.log("❌ Not Found (404)");
             } else {
                 console.log(`❌ Error: ${e.message.split('[')[0]}`); // Print simplified error
             }
        }
    }
    
    console.log("\n❌ NO standard models worked. Your API Key might be invalid or restricted.");

  } catch (error) {
    console.error("Error during diagnosis:", error);
  }
}

listModels();