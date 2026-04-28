import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt, setPrompt, reply, setReply, currThreadId,
    prevChats, setPrevChats, setNewChat, userId, setIsSidebarOpen
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChat(false);

    const currentPrompt = prompt;
    setPrompt(""); // Clear input early for better UX
    setPrevChats((prev) => [...prev, { role: "user", content: currentPrompt }]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentPrompt, threadId: currThreadId, userId }),
      });
      const res = await response.json();
      if (!response.ok || res.error) throw new Error(res.error || "Failed to get response");
      if (res.reply) setReply(res.reply);
    } catch (err) {
      console.error("Error:", err);
      setPrevChats((prev) => [...prev, { role: "assistant", content: "⚠️ Error: " + err.message }]);
      setReply(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!reply) return;
    setPrevChats((prev) => [...prev, { role: "assistant", content: reply }]);
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <div className="nav-left">
          <i className="fa-solid fa-bars hamburger" onClick={() => setIsSidebarOpen(true)}></i>
          <span>PhotonAI</span>
        </div>
        <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
          <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
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
          <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        <p className="info">PhotonAI can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}

export default ChatWindow;