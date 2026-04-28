import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const getInitialUserId = () => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = uuidv1();
      localStorage.setItem("userId", id);
    }
    return id;
  };

  const [userId] = useState(getInitialUserId);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); 
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);

  // --- NEW STATES FOR STOP BUTTON ---
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [stopTyping, setStopTyping] = useState(false);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    userId,
    isSidebarOpen, setIsSidebarOpen,
    loading, setLoading,
    isTyping, setIsTyping,
    stopTyping, setStopTyping
  };

  return (
    <div className="app">
      <div className="ai-background">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;