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

// ✅ Enable CORS for both Netlify & localhost
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local dev
      "https://photonai.netlify.app", // your actual Netlify frontend URL (replace this with yours)
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ API routes
app.use("/api", chatRoutes);

// ✅ Connect to MongoDB
async function connectDB() {
  try {
    console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected with Database!");
  } catch (err) {
    console.error("❌ Failed to connect with Db", err);
  }
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
  connectDB();
});
