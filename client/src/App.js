// client/src/App.js

import React, { useState } from 'react';
import './App.css';           // もし App.css を消していれば、この行も削除してOK
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

