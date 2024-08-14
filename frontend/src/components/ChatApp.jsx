import React from "react";
import ChatRoom from "./ChatRoom";
import WeatherWidget from "./WeatherWidget";
import "./ChatApp.css";

const ChatApp = () => {
  return (
    <div className="chat-app">
      <div className="header">
        <h1>My Chat Application</h1>
        <WeatherWidget />
      </div>
      <div className="chat-room-container">
        <ChatRoom />
      </div>
      <div className="footer">
        <p>© 2024 My Chat Application. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ChatApp;

