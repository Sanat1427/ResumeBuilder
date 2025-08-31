import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRouter.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Use Render-assigned PORT (fallback 4000 for local dev)
const PORT = process.env.PORT || 4000;

// ✅ Allowed origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173",                     // local dev
  "https://resume-builder-nine-cyan.vercel.app" // deployed frontend
];

// ✅ CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to Database
connectDB();

// ✅ API Routes
app.use("/api/auth", userRoutes);
app.use("/api/resume", resumeRoutes);

// ✅ Serve uploads with proper CORS headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, _path) => {
      // Allow both local + deployed frontend to fetch images
      if (allowedOrigins.includes("http://localhost:5173")) {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      }
      res.setHeader(
        "Access-Control-Allow-Origin",
        "https://resume-builder-nine-cyan.vercel.app"
      );
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    },
  })
);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("API WORKING 🚀");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
