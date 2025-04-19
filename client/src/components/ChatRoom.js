// client/src/components/ChatRoom.js

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export default function ChatRoom({ nickname }) {
  const [socket] = useState(() => io(SOCKET_URL));
  const [room] = useState('general');                // 固定ルーム名
  const [message, setMessage] = useState('');        // 入力中のテキスト
  const [messages, setMessages] = useState([]);      // 受信メッセージの配列

  useEffect(() => {
    // ルーム参加
    socket.emit('join_room', room);
    // メッセージ受信時のハンドラ
    socket.on('receive_message', data => {
      setMessages(prev => [...prev, data]);
    });
    // コンポーネントアンマウント時に切断
    return () => socket.disconnect();
  }, [socket, room]);

  // メッセージ送信
  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('send_message', {
      room,
      author: nickname,
      message
    });
    setMessage('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>ようこそ、{nickname} さん (ルーム: {room})</h2>
      <div style={{
        border: '1px solid #ccc',
        height: '300px',
        overflowY: 'auto',
        padding: '0.5rem',
        marginBottom: '1rem'
      }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.author}</strong> <small>({new Date(m.timestamp).toLocaleTimeString()})</small>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <div>
        <input
          style={{ width: '70%', marginRight: '0.5rem' }}
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="メッセージを入力…"
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}
