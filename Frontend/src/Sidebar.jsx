import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  // ✅ Fetch all chat threads
  const getAllThreads = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread`
      );
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.error("Error fetching threads:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  // ✅ Create new chat
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  // ✅ Load messages of selected thread
  const changeThread = async (newThreadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`
      );
      const res = await response.json();

      // If response is an array of messages (as your backend sends)
      if (Array.isArray(res)) {
        setPrevChats(res);
      } else {
        setPrevChats([]);
      }

      setCurrThreadId(newThreadId);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error("Error loading thread:", err);
    }
  };

  // ✅ Delete thread
  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/thread/${threadId}`,
        { method: "DELETE" }
      );
      const res = await response.json();
      console.log(res);

      // Update sidebar after deletion
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      // If the current chat was deleted — start a new one
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
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
                e.stopPropagation(); // stop event bubbling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>Developed with &hearts; By Saurabh</p>
      </div>
    </section>
  );
}

export default Sidebar;
