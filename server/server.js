require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', socket => {
  console.log(`✅ Connected: ${socket.id}`);

  socket.on('join_room', room => {
    socket.join(room);
    console.log(`🔑 ${socket.id} joined ${room}`);
  });

  socket.on('send_message', ({ room, author, message }) => {
    const payload = { author, message, timestamp: Date.now() };
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
