import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ addMessage }) => {
  const [text, setText] = useState('');

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === '') return;
    addMessage(text);
    setText('');
  };

  return (
    <form className="message-input" onSubmit={handleMessageSubmit}>
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;                 

