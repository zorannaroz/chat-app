import React, { useEffect, useRef, useState } from "react";
import "./MessageList.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const animalIcons = [
  "fas fa-cat",
  "fas fa-dog",
  "fas fa-hippo",
  "fas fa-frog",
  "fas fa-dragon",
  "fas fa-dove",
  "fas fa-fish",
  "fas fa-horse",
  "fas fa-spider",
  "fas fa-otter",
];

const MessageList = ({ messages }) => {
  const [iconMap, setIconMap] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIconMap((prevIconMap) => {
      const newIconMap = { ...prevIconMap };

      messages.forEach((message) => {
        const { senderId } = message;
        if (!newIconMap[senderId]) {
          const availableIcons = animalIcons.filter(
            (icon) => !Object.values(newIconMap).includes(icon)
          );
          const randomIcon =
            availableIcons[Math.floor(Math.random() * availableIcons.length)];
          newIconMap[senderId] = randomIcon;
        }
      });

      return newIconMap;
    });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((message) => {
        const { senderId, id, text, timestamp } = message;
        const messageId = id || timestamp;
        if (!messageId) {
          console.error("Message without ID:", message);
        }

        const userIcon = iconMap[senderId];

        return (
          <div key={messageId} className="message">
            <i className={`icon ${userIcon}`}></i>
            <div className="message-content">
              <p className="text">{text}</p>
              <span className="timestamp">{timestamp}</span>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
