// server/models/Message.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  room:      { type: String, required: true },
  author:    { type: String, required: true },
  message:   { type: String, required: true },
  timestamp: { type: Date,   default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
