import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads, setAllThreads,
    currThreadId, setCurrThreadId,
    setNewChat, setPrompt, setReply, setPrevChats,
    userId, isSidebarOpen, setIsSidebarOpen
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread/all/${userId}`);
      const res = await response.json();
      if (Array.isArray(res)) setAllThreads(res);
    } catch (err) {
      console.error("Error fetching threads:", err);
    }
  };

  useEffect(() => {
    if (userId) getAllThreads();
  }, [currThreadId, userId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
  };

  const changeThread = async (newThreadId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${userId}/${newThreadId}`);
      const res = await response.json();
      setPrevChats(Array.isArray(res) ? res : []);
      setCurrThreadId(newThreadId);
      setNewChat(false);
      setReply(null);
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
    } catch (err) {
      console.error("Error loading thread:", err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/thread/${userId}/${threadId}`, { method: "DELETE" });
      setAllThreads((prev) => prev.filter((t) => t.threadId !== threadId));
      if (threadId === currThreadId) createNewChat();
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  return (
    <>
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <section className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button onClick={createNewChat}>
          <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
          <span><i className="fa-solid fa-pen-to-square"></i></span>
        </button>

        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>
        <div className="sign"><p>Developed with &hearts; By Saurabh</p></div>
      </section>
    </>
  );
}

export default Sidebar;