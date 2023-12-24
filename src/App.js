import "./App.css";
import MyLineChart from "./components/MyLineChart";
import ChatBotComponent from "./components/ChatBotComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestComponent from "./components/TestComponent";

function App() {
  return (
    <div className="App">
      {/* <MyLineChart /> */}

      <Routes>
        {/* <Route path="/" element={<ChatBotWrapper />} /> */}
        <Route path="/test" element={<TestComponent />} />
      </Routes>

      <ChatBotComponent />
    </div>
  );
}

export default App;
