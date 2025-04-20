// client/src/components/ChatRoom.js

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export default function ChatRoom({ nickname }) {
  // ① ソケットは一度だけ生成（autoConnect: false で明示的に接続）
  const [socket] = useState(() => {
    const sock = io(SOCKET_URL, { autoConnect: false });
    return sock;
  });

  const [room] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // ② 入室時に過去メッセージを取得
    fetch(`${process.env.REACT_APP_BACKEND_URL}/messages/${room}`)
      .then(res => res.json())
      .then(data => {
        console.log('📃 [Client] initial messages:', data);
        setMessages(data);
      })
      .catch(err => console.error('❌ [Client] 初期メッセージ取得失敗:', err));

    // ③ 接続開始
    socket.connect();
    console.log('🟢 [Client] socket connecting...');

    // ④ 接続完了したらルーム参加
    socket.on('connect', () => {
      console.log('🟢 [Client] connected, id:', socket.id);
      console.log(`🔑 [Client] emitting join_room → ${room}`);
      socket.emit('join_room', room);
    });

    // ⑤ メッセージ受信
    socket.on('receive_message', data => {
      console.log('⬅️ [Client] receive_message:', data);
      setMessages(prev => [...prev, data]);
    });

    // クリーンアップ（アンマウント時）
    return () => {
      socket.off('connect');
      socket.off('receive_message');
      socket.disconnect();
      console.log('❌ [Client] socket disconnected');
    };
  }, [socket, room]);

  // ⑥ メッセージ送信
  const sendMessage = () => {
    if (!message.trim()) return;
    console.log('➡️ [Client] send_message:', message);
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
        height: 300,
        overflowY: 'auto',
        padding: '0.5rem',
        marginBottom: '1rem'
      }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.author}</strong>
            <small> ({new Date(m.timestamp).toLocaleTimeString()})</small>
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
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="メッセージを入力…"
        />
        <button onClick={sendMessage}>送信</button>
      </div>
    </div>
  );
}
