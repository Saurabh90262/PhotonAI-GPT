import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Enable CORS for both Netlify & local development
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://photon-ai.netlify.app", // ✅ match your actual Netlify domain exactly
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ API routes
app.use("/api", chatRoutes);

// ✅ Root route to verify backend is running
app.get("/", (req, res) => {
  res.send("✅ PhotonAI backend is live!");
});

// ✅ Connect to MongoDB
async function connectDB() {
  try {
    console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected with Database!");
  } catch (err) {
    console.error("❌ Failed to connect with DB", err);
  }
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
