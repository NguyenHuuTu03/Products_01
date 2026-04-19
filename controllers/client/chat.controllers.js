const User = require("../../models/user.model");
const Chats = require("../../models/chat.models");

const chatSocket = require('../../sockets/client/chat.socket');

// [GET] /chat
module.exports.index = async (req, res) => {

  // socket.io
  chatSocket(res);
  // socket.io
  const chats = await Chats.find({
    deleted: false
  });
  for (const chat of chats) {
    const userInfo = await User.findOne({
      _id: chat.user_id
    }).select("fullName avatar");
    chat.userInfo = userInfo;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  });
}