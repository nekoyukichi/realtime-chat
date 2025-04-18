import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
// import ChatRoom from './components/ChatRoom'; // ← 後で作成するので今はコメントアウト

function App() {
  const [nickname, setNickname] = useState(null);

  return (
    <div className="App">
      {nickname
        ? <div>ChatRoomへ進む予定（まだ未実装）</div>
        : <Login onLogin={setNickname} />
      }
    </div>
  );
}

export default App;

