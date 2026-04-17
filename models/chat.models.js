const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  user_id: String,
  room_chat_id: String,
  images: Array,
  content: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date
}, {
  timestamps: true
});

const Chats = mongoose.model("Chats", chatSchema, "chats");
module.exports = Chats;