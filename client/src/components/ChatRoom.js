import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export default function ChatRoom({ nickname }) {
  const [socket] = useState(() =>
    io(SOCKET_URL, { autoConnect: false, transports: ['websocket'] })
  );
  const [room] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 過去メッセージ取得
    fetch(`${process.env.REACT_APP_BACKEND_URL}/messages/${room}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(() => {});

    // ソケット接続
    socket.connect();
    socket.on('connect', () => socket.emit('join_room', room));
    socket.on('receive_message', data =>
      setMessages(prev => [...prev, data])
    );
    return () => socket.disconnect();
  }, [socket, room]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('send_message', { room, author: nickname, message });
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-lg font-medium">ルーム: {room}</h1>
        <span className="text-gray-600">ようこそ、{nickname}さん</span>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xs px-3 py-2 rounded-lg ${
              m.author === nickname
                ? 'bg-blue-100 self-end'
                : 'bg-white self-start'
            }`}
          >
            <p className="text-sm">
              <strong>{m.author}</strong>{' '}
              <span className="text-gray-400 text-xs">
                {new Date(m.timestamp).toLocaleTimeString()}
              </span>
            </p>
            <p className="mt-1">{m.message}</p>
          </div>
        ))}
      </main>
      <footer className="bg-white p-4 flex">
        <input
          className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="メッセージを入力…"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r"
        >
          送信
        </button>
      </footer>
    </div>
  );
}
