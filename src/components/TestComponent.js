import React from "react";
import { useLocation } from "react-router-dom";
import ChatBotComponent from "./ChatBotComponent";

const TestComponent = () => {
  const location = useLocation();
  const apiResponse = location.state?.response;

  return (
    <div>
      <ChatBotComponent />
      <h2>API Response</h2>
      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
    </div>
  );
};

export default TestComponent;
