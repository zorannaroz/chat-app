import React, { useState } from "react";
import ChatApp from "./components/ChatApp";
import LoginForm from "./components/LoginForm";
import '@fortawesome/fontawesome-free/css/all.min.css';

import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <div className="phone-header">
        <div className="status-bar"></div>
      </div>
      {isLoggedIn ? <ChatApp /> : <LoginForm onLogin={handleLogin} />}
      <div className="phone-footer">© 2024 My Chat Application</div>
    </div>
  );
};

export default App;
