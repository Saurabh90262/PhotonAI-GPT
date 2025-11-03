import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Send message and get reply from backend
  const getReply = async () => {
    if (!prompt.trim()) return; // avoid empty sends
    setLoading(true);
    setNewChat(false);

    console.log("Sending message:", prompt, "Thread ID:", currThreadId);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        options
      );
      const res = await response.json();
      console.log("Response:", res);

      // ✅ First add user message immediately
      setPrevChats((prev) => [...prev, { role: "user", content: prompt }]);

      // ✅ Then set reply, which triggers typing effect in Chat.jsx
      setReply(res.reply);
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  };

  // ✅ Append assistant reply (only after typing is finished)
  useEffect(() => {
    if (!reply) return;

    // Add assistant reply as last message
    setPrevChats((prev) => [...prev, { role: "assistant", content: reply }]);

    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          PhotonAI <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          PhotonAI can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
