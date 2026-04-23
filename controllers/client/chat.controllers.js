const User = require("../../models/user.model");
const Chats = require("../../models/chat.models");
const RoomChat = require("../../models/room-chat.model");

const chatSocket = require('../../sockets/client/chat.socket');

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {

  const roomChatId = req.params.roomChatId;

  // socket.io
  chatSocket(req, res);
  // socket.io
  const chats = await Chats.find({
    room_chat_id: roomChatId,
    deleted: false
  });
  for (const chat of chats) {
    const userInfo = await User.findOne({
      _id: chat.user_id
    }).select("fullName avatar");
    chat.userInfo = userInfo;
  }

  const roomChat = await RoomChat.findOne({
    _id: roomChatId
  });
  const userFind = roomChat.users.find(
    user => user.user_id != res.locals.user.id
  );

  const youUser = await User.findOne({
    _id: userFind.user_id
  }).select("avatar fullName");
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
    youUser: youUser
  });
}
// [GET] /chat-group/:roomChatId
module.exports.chatGroup = async (req, res) => {

  const roomChatId = req.params.roomChatId;

  // socket.io
  chatSocket(req, res);
  // socket.io
  const chats = await Chats.find({
    room_chat_id: roomChatId,
    deleted: false
  });
  for (const chat of chats) {
    const userInfo = await User.findOne({
      _id: chat.user_id
    }).select("fullName avatar");
    chat.userInfo = userInfo;
  }

  const roomChat = await RoomChat.findOne({
    _id: roomChatId
  });
  const userFind = roomChat.users.find(user => user.user_id != res.locals.user.id);
  const youUser = await User.findOne({
    _id: userFind.user_id
  }).select("avatar fullName");
  res.render("client/pages/chat/chat-group", {
    pageTitle: "Chat Group",
    chats: chats,
    youUser: youUser
  });
}