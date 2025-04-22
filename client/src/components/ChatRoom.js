import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export default function ChatRoom({ nickname }) {
  const [socket] = useState(() => io(SOCKET_URL, { autoConnect: false }));
  const [room] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/messages/${room}`)
      .then(res => res.json())
      .then(data => setMessages(data));

    socket.connect();
    socket.on('connect', () => socket.emit('join_room', room));
    socket.on('receive_message', data => setMessages(prev => [...prev, data]));
    return () => socket.disconnect();
  }, [socket, room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit('send_message', { room, author: nickname, message });
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Header */}
      <header className="backdrop-blur bg-indigo-600/80 text-white py-3 px-6 flex justify-between items-center shadow-lg">
        <h1 className="font-semibold">ルーム: {room}</h1>
        <span className="text-sm italic">{nickname}</span>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.map((m, i) => {
          const isMe = m.author === nickname;
          return (
            <div
              key={i}
              className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl shadow-md text-sm leading-relaxed ${
                isMe
                  ? 'ml-auto bg-green-400 text-white rounded-br-none'
                  : 'mr-auto bg-white text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="flex justify-between text-[10px] opacity-70 mb-1">
                <span>{m.author}</span>
                <span>{new Date(m.timestamp).toLocaleTimeString()}</span>
              </div>
              {m.message}
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </main>

      {/* Input */}
      <footer className="bg-white shadow-inner px-4 py-3 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="メッセージを入力…"
          className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-2 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl transition"
        >
          送信
        </button>
      </footer>
    </div>
  );
}