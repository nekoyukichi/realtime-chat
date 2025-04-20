require('dotenv').config();
require('./db'); 
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.get('/messages/:room', async (req, res) => {
  try {
    const Message = require('./models/Message');
    const msgs = await Message
      .find({ room: req.params.room })
      .sort('timestamp');
    res.json(msgs);
  } catch (err) {
    console.error('❌ [API] メッセージ取得エラー:', err);
    res.status(500).json({ error: 'メッセージ取得失敗' });
  }
});

io.on('connection', socket => {
  console.log(`✅ Connected: ${socket.id}`);

  socket.on('join_room', room => {
    socket.join(room);
    console.log(`🔑 ${socket.id} joined ${room}`);
  });

  socket.on('send_message', ({ room, author, message }) => {
    // サーバーログ
    console.log(
      `📥 [サーバー] send_message 受信 → ` +
      `room: ${room}, author: ${author}, message: ${message}`
    );
  
    // 送信ペイロードの作成
    const payload = {
      room,
      author,
      message,
      timestamp: Date.now()
    };
  
    // DB に保存
    const Message = require('./models/Message');
    new Message(payload)
      .save()
      .then(() => {
        console.log('✅ [DB] メッセージ保存成功');
      })
      .catch(err => {
        console.error('❌ [DB] メッセージ保存エラー:', err);
      });
  
    // 既存のブロードキャスト
    io.to(room).emit('receive_message', payload);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
