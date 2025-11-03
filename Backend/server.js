import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";   // 👈 only ./config, NOT ./Backend/config
import chatRoutes from "./routes/chat.js"; // 👈 only ./routes, NOT ./Backend/routes

dotenv.config();

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: ["https://photon-ai.netlify.app"], // your frontend URL
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use("/api", chatRoutes);

// ✅ Connect to DB
connectDB();

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚀 PhotonAI Backend is running successfully!");
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
