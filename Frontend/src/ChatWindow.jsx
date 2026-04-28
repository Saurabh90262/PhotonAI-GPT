import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt, setPrompt, reply, setReply, currThreadId,
    prevChats, setPrevChats, setNewChat, userId, isSidebarOpen, setIsSidebarOpen,
    loading, setLoading, isTyping, stopTyping, setStopTyping
  } = useContext(MyContext);

  const [isOpen, setIsOpen] = useState(false);
  const abortControllerRef = useRef(null);

  // Check if either network is loading OR animation is typing
  const isResponding = loading || isTyping;

  const handleStop = () => {
    if (loading) {
      // Abort the network request
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setLoading(false);
    } else if (isTyping) {
      // Skip the typing animation
      setStopTyping(true);
    }
  };

  const getReply = async () => {
    if (!prompt.trim() || isResponding) return;
    
    setLoading(true);
    setStopTyping(false);
    setNewChat(false);
    setReply(null); // <-- THE FIX: Clear the old reply immediately!

    const currentPrompt = prompt;
    setPrompt(""); 
    setPrevChats((prev) => [...prev, { role: "user", content: currentPrompt }]);

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentPrompt, threadId: currThreadId, userId }),
        signal: abortControllerRef.current.signal // Attach the abort signal
      });
      
      const res = await response.json();
      if (!response.ok || res.error) throw new Error(res.error || "Failed to get response");
      if (res.reply) setReply(res.reply);
      
    } catch (err) {
      if (err.name === 'AbortError') {
        // If aborted by the user
        setPrevChats((prev) => [...prev, { role: "assistant", content: "🚫 *Response stopped by user.*" }]);
      } else {
        // Real errors
        console.error("Error:", err);
        setPrevChats((prev) => [...prev, { role: "assistant", content: "⚠️ Error: " + err.message }]);
      }
      setReply(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!reply) return;
    setPrevChats((prev) => [...prev, { role: "assistant", content: reply }]);
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <div className="nav-left">
          {!isSidebarOpen && (
            <i 
              className="fa-solid fa-bars hamburger show-desktop" 
              onClick={() => setIsSidebarOpen(true)}
            ></i>
          )}
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
      
      {/* Only show ScaleLoader when network is fetching, not during typing */}
      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isResponding && getReply()}
          />
          {/* Dynamic Button: Changes based on isResponding state */}
          <div id="submit" onClick={isResponding ? handleStop : getReply}>
            {isResponding ? (
               <i className="fa-solid fa-stop"></i>
            ) : (
               <i className="fa-solid fa-paper-plane"></i>
            )}
          </div>
        </div>
        <p className="info">PhotonAI can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}

export default ChatWindow;