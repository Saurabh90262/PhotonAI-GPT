import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import chatRoutes from "./routes/chat.js";
import threadRoutes from "./routes/thread.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://photon-ai.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/thread", threadRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("🚀 PhotonAI Backend is running successfully!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));