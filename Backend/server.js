import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Explicitly load .env from same folder as server.js
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);

async function connectDB() {
  try {
    console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected with Database!");
  } catch (err) {
    console.error("❌ Failed to connect with Db", err);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
  connectDB();
});



// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//     }
// });

