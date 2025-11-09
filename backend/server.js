import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

// ✅ Routes
import userRoutes from "./routes/userRouter.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Use Render-assigned PORT (fallback 4000 for local dev)
const PORT = process.env.PORT || 4000;

// ✅ Allowed origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173", // Local Vite frontend
  "https://resumebuilder-frontend-6gjz.onrender.com", // Deployed Render frontend
];

// ✅ Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ API Routes
app.use("/api/auth", userRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes); // AI route mounted here

// ✅ Serve uploads folder with dynamic CORS headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      allowedOrigins.forEach((origin) => {
        res.setHeader("Access-Control-Allow-Origin", origin);
      });
      res.setHeader("Access-Control-Allow-Methods", "GET");
    },
  })
);

// ✅ Root route (for testing)
app.get("/", (req, res) => {
  res.send("🚀 Resume Builder Backend is running successfully!");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
