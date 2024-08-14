import React, { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { v4 as uuidv4 } from "uuid";
import "./ChatRoom.css";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  const connectWebSocket = () => {
    const username = import.meta.env.VITE_WS_USERNAME;
    const password = import.meta.env.VITE_WS_PASSWORD;
    const wsUrl = `ws://localhost:3001?username=${username}&password=${password}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.current.onmessage = (event) => {
      const data = event.data;

      if (typeof data === "string") {
        try {
          const message = JSON.parse(data);
          if (!message.id) {
            message.id = uuidv4();
          }
          setMessages((prevMessages) => [...prevMessages, message]);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      } else if (data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          try {
            const message = JSON.parse(text);
            if (!message.id) {
              message.id = uuidv4();
            }
            setMessages((prevMessages) => [...prevMessages, message]);
          } catch (error) {
            console.error("Error parsing Blob message:", error);
          }
        };
        reader.readAsText(data);
      } else {
        console.error("Unexpected data type:", typeof data);
      }
    };

    ws.current.onerror = (event) => {
      console.error("WebSocket error occurred:", event);
     
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket connection closed");
     
      setTimeout(connectWebSocket, 1000);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const addMessage = (text) => {
    const newMessage = {
      id: uuidv4(),
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(newMessage));
    } else {
      console.error(
        "WebSocket is not open. Ready state:",
        ws.current ? ws.current.readyState : "No WebSocket instance"
      );
    }
  };

  return (
    <div className="chat-room">
      <MessageList messages={messages} />
      <MessageInput addMessage={addMessage} />
    </div>
  );
};

export default ChatRoom;


