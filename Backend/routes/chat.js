import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

// ✅ Test route (optional)
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread2",
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// ✅ Get all threads (for sidebar)
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}, "threadId title updatedAt").sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// ✅ Get a single thread by ID (for loading previous chats)
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages || []); // return empty array if no messages
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// ✅ Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// ✅ Chat route (main route for sending/receiving messages)
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // create new thread if not exists
      thread = new Thread({
        threadId,
        title: message.substring(0, 40), // limit title length
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // ✅ Call OpenAI API
    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
