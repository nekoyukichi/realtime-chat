import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';

function App() {
  const [nickname, setNickname] = useState(null);

  return (
    <div className="App">
      {nickname
        ? <ChatRoom nickname={nickname} />
        : <Login onLogin={setNickname} />
      }
    </div>
  );
}

export default App;
