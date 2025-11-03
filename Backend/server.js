import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Backend/config/db.js";  // 👈 capital B
import chatRoutes from "./Backend/routes/chat.js"; // 👈 capital B

dotenv.config();

const app = express();

// ✅ Allow only your Netlify frontend domain
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

// ✅ Connect MongoDB
connectDB();

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 PhotonAI Backend is running successfully!");
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
