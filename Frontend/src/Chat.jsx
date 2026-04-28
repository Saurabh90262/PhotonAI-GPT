import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply, setIsTyping, stopTyping, setStopTyping } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const chatEndRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!reply) {
      setLatestReply(null); 
      setIsTyping(false);
      return;
    }
    if (!prevChats?.length) return;

    setIsTyping(true);
    let idx = 0;
    
    // Clear any existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      idx += 3;
      setLatestReply(reply.slice(0, idx));
      if (idx >= reply.length) {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 15);

    return () => {
      clearInterval(intervalRef.current);
      setIsTyping(false);
    };
  }, [reply, prevChats.length, setIsTyping]);

  // Listener for the "Skip Animation" stop button action
  useEffect(() => {
    if (stopTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLatestReply(reply); // Jump straight to the full text
      setIsTyping(false);
      setStopTyping(false); // Reset signal
    }
  }, [stopTyping, reply, setIsTyping, setStopTyping]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: newChat ? "auto" : "smooth" });
    }
  }, [prevChats, latestReply, newChat]);

  const displayChats = [...prevChats];
  if (latestReply !== null) {
    const lastMsg = displayChats[displayChats.length - 1];
    if (lastMsg && lastMsg.role === "assistant") {
      displayChats[displayChats.length - 1] = { ...lastMsg, content: latestReply };
    } else {
      displayChats.push({ role: "assistant", content: latestReply });
    }
  }

  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}
      <div className="chats">
        {displayChats.map((chat, idx) => (
          <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content || ""}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content || ""}
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