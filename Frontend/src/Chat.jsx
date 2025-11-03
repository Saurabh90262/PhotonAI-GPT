import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const chatEndRef = useRef(null);

  // Typing effect for replies
  useEffect(() => {
    if (reply === null) {
      setLatestReply(null); // When loading old chat, no typing
      return;
    }

    if (!prevChats?.length) return;

    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [reply]);

  // Auto-scroll
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: newChat ? "auto" : "smooth",
      });
    }
  }, [prevChats, latestReply, newChat]);

  // ✅ Combine prevChats + latest typing for display
  const displayChats = [...prevChats];
  if (latestReply !== null) {
    // replace last assistant message (if exists)
    const lastMsg = displayChats[displayChats.length - 1];
    if (lastMsg && lastMsg.role === "assistant") {
      displayChats[displayChats.length - 1] = {
        ...lastMsg,
        content: latestReply,
      };
    } else {
      displayChats.push({ role: "assistant", content: latestReply });
    }
  }

  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}
      <div className="chats">
        {displayChats.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        <div ref={chatEndRef}></div>
      </div>
    </>
  );
}

export default Chat;
