import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, threadId, message } = req.body;

  if (!userId || !threadId || !message) {
    return res.status(400).json({ error: "userId, threadId, and message are required" });
  }

  try {
    let thread = await Thread.findOne({ userId, threadId });

    if (!thread) {
      thread = new Thread({
        userId,
        threadId,
        title: message.substring(0, 40) + "...",
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGeminiResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply: assistantReply });

  } catch (err) {
    console.error("Chat Error Details:", err);
    res.status(500).json({ 
      error: "Backend Error: " + (err.message || "Something went wrong")
    });
  }
});

export default router;