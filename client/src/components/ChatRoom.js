import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export default function ChatRoom({ nickname }) {
  const [socket] = useState(() => io(SOCKET_URL, { autoConnect: false }));
  const [room] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

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
    inputRef.current?.focus();
  };

  // 日付変更線を表示するかどうかを判断する関数
  const shouldShowDateDivider = (message, index) => {
    if (index === 0) return true;
    
    const currentDate = new Date(message.timestamp).toLocaleDateString();
    const prevDate = new Date(messages[index - 1].timestamp).toLocaleDateString();
    
    return currentDate !== prevDate;
  };

  // メッセージを送信者ごとにグループ化する関数
  const isSameSender = (message, index) => {
    if (index === 0) return false;
    
    return messages[index - 1].author === message.author &&
      new Date(message.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() < 60000; // 1分以内なら同じグループ
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white text-gray-800 py-3 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <button className="mr-3 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="font-bold text-lg">{room}</h1>
            <p className="text-xs text-gray-500">オンライン: {nickname}</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg, i) => {
          const isMe = msg.author === nickname;
          const showDateDivider = shouldShowDateDivider(msg, i);
          const groupWithPrevious = isSameSender(msg, i);
          
          return (
            <React.Fragment key={i}>
              {showDateDivider && (
                <div className="flex justify-center my-4">
                  <div className="bg-gray-200 text-xs text-gray-500 px-3 py-1 rounded-full">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </div>
                </div>
              )}
              
              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${!groupWithPrevious ? 'mt-3' : 'mt-1'}`}>
                {!isMe && !groupWithPrevious && (
                  <div className="flex flex-col items-center mr-2 mt-1">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                      {msg.author.charAt(0).toUpperCase()}
                    </div>
                    {!groupWithPrevious && (
                      <span className="text-xs text-gray-500 mt-1">{msg.author}</span>
                    )}
                  </div>
                )}
                
                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl ${
                  isMe 
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                } ${isMe && !groupWithPrevious ? 'rounded-tr-none' : ''} ${!isMe && !groupWithPrevious ? 'rounded-tl-none' : ''}`}>
                  <div className="text-sm">{msg.message}</div>
                  <div className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-400'} text-right mt-1`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef}></div>
      </main>

      {/* Input */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`p-2 rounded-full ${
              message.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}