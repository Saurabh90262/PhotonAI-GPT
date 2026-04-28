import express from "express";
import Thread from "../models/Thread.js";

const router = express.Router();

router.get("/all/:userId", async (req, res) => {
  try {
    const threads = await Thread.find(
      { userId: req.params.userId },
      "threadId title updatedAt"
    ).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

router.get("/:userId/:threadId", async (req, res) => {
  const { userId, threadId } = req.params;
  try {
    const thread = await Thread.findOne({ userId, threadId });
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json(thread.messages || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

router.delete("/:userId/:threadId", async (req, res) => {
  const { userId, threadId } = req.params;
  try {
    const deleted = await Thread.findOneAndDelete({ userId, threadId });
    if (!deleted) return res.status(404).json({ error: "Thread not found" });
    res.json({ success: true, message: "Thread deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

export default router;