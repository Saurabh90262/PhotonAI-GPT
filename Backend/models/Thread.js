import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ThreadSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  threadId: { type: String, required: true },
  title: { type: String, default: "New Chat" },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ThreadSchema.index({ userId: 1, threadId: 1 }, { unique: true });

export default mongoose.model("Thread", ThreadSchema);