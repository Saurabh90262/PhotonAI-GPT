import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  // Synchronous User ID generation to ensure isolation on new devices
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile state

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    userId,
    isSidebarOpen, setIsSidebarOpen
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;