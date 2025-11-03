import { createContext, useState } from "react";

// Create context
export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [allThreads, setAllThreads] = useState([]);       // all chat threads (sidebar)
  const [currThreadId, setCurrThreadId] = useState(null); // current active thread
  const [prompt, setPrompt] = useState("");               // current input
  const [reply, setReply] = useState(null);               // assistant reply
  const [newChat, setNewChat] = useState(true);           // new chat flag
  const [prevChats, setPrevChats] = useState([]);         // chat history of selected thread

  return (
    <MyContext.Provider
      value={{
        allThreads,
        setAllThreads,
        currThreadId,
        setCurrThreadId,
        prompt,
        setPrompt,
        reply,
        setReply,
        newChat,
        setNewChat,
        prevChats,
        setPrevChats,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
