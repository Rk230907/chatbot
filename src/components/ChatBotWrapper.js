import React from "react";
import { useNavigate } from "react-router-dom";
import ChatBotComponent from "./ChatBotComponent";

function ChatBotWrapper() {
  const navigate = useNavigate();
  return <ChatBotComponent navigate={navigate} />;
}

export default ChatBotWrapper;
