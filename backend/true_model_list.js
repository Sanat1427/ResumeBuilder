// true_model_list.js
import dotenv from 'dotenv';
// We will use standard Node fetch to bypass SDK quirks
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function getAvailableModels() {
    console.log("🕵️ contacting Google API directly to find YOUR available models...\n");

    if (!API_KEY) {
        console.error("❌ FATAL: GEMINI_API_KEY is missing from your .env file");
        return;
    }

    // This is the raw REST API endpoint to list models
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        
        if (response.status !== 200) {
            console.error(`❌ API ERROR: ${response.status} ${response.statusText}`);
            console.error("Your API Key is invalid, expired, or from the wrong service (like Vertex AI).");
            return;
        }

        const data = await response.json();

        if (!data.models) {
             console.log("❌ Connection successful, but NO models returned. Your account might be restricted.");
             return;
        }

        console.log("✅ SUCCESS! Here are the EXACT names your key can use:\n");
        console.log("--- COPY ONE OF THESE NAMES ---");
        
        // Filter only for models that can generate text
        const usableModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        
        usableModels.forEach(model => {
            // The API returns "models/gemini-pro", we just need "gemini-pro"
            console.log(`"${model.name.replace('models/', '')}"`);
        });
        console.log("-------------------------------\n");

    } catch (error) {
        console.error("Network error:", error.message);
    }
}

getAvailableModels();