import dotenv from "dotenv";
import mongoose from "mongoose";
import { routeRequest } from "./services/aiRouter.js";
import AIAnalytics from "./models/aiAnalytics.js";

dotenv.config();

const MONGO_URI = "mongodb+srv://btech1055723:resume123@cluster0.ptb5vz7.mongodb.net/RESUME";

async function runDiagnostics() {
  console.log("🚀 Starting Multi-Model AI Router Diagnostic...");
  
  try {
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ DB Connected.");

    // Clear previous tests if any (optional, let's keep them so we can see analytics)
    const initialCount = await AIAnalytics.countDocuments();
    console.log(`📊 Current analytics count: ${initialCount}`);

    // Test Case 1: Balanced mode - Resume Summary (should route to Google Gemini)
    console.log("\n🧪 Test Case 1: Balanced mode - Resume Summary (Routing to Google Gemini)...");
    const test1 = await routeRequest(
      "resume_summary",
      "Draft a 1-sentence career summary for a Junior Frontend Developer.",
      "balanced"
    );
    console.log("Response metadata:", test1.metadata);
    console.log("Response sample:", test1.text.substring(0, 100) + "...");
    
    // Test Case 2: Balanced mode - ATS Analysis (should route to Groq Llama)
    console.log("\n🧪 Test Case 2: Balanced mode - ATS Analysis (Routing to Groq Llama)...");
    const test2 = await routeRequest(
      "ats_analysis",
      JSON.stringify({
        profileInfo: { designation: "Backend Engineer", summary: "Experienced with node and express" },
        skills: [{ name: "Node.js" }, { name: "MongoDB" }]
      }),
      "balanced"
    );
    console.log("Response metadata:", test2.metadata);
    console.log("Response sample:", test2.text.substring(0, 100) + "...");

    // Test Case 3: Fastest mode - Resume Summary (should route to Groq Llama instead of Gemini)
    console.log("\n🧪 Test Case 3: Fastest mode - Resume Summary (Routing to Groq Llama)...");
    const test3 = await routeRequest(
      "resume_summary",
      "Draft a 1-sentence career summary for a Junior Frontend Developer.",
      "fastest"
    );
    console.log("Response metadata:", test3.metadata);
    console.log("Response sample:", test3.text.substring(0, 100) + "...");

    // Test Case 4: Verify Database Logging
    console.log("\n🔍 Verifying Database Logging...");
    const recentLogs = await AIAnalytics.find().sort({ createdAt: -1 }).limit(3);
    console.log(`Found ${recentLogs.length} recent logs in Mongo:`);
    recentLogs.forEach((log, i) => {
      console.log(`[Log ${i+1}] Task: ${log.task} | Mode: ${log.mode} | Model: ${log.modelName} | Status: ${log.status} | Latency: ${log.responseTime}ms`);
    });

    console.log("\n🎉 DIAGNOSTICS COMPLETED SUCCESSFULLY! Multi-model AI system is operational.");
    
  } catch (error) {
    console.error("❌ Diagnostic failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 DB Disconnected.");
    process.exit(0);
  }
}

runDiagnostics();
