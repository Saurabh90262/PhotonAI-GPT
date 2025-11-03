import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

// ✅ Allow only your frontend domain (Netlify)
app.use(
  cors({
    origin: ["https://photon-ai.netlify.app"], // your deployed frontend URL
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api", chatRoutes);

// Database connection
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("PhotonAI Backend is running successfully!");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
