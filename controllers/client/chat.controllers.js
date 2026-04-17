const Chats = require("../../models/chat.models");
const User = require("../../models/user.model");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // socket.io
  _io.once('connection', (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      // lưu data vào db
      const chat = new Chats({
        user_id: userId,
        content: content
      });
      await chat.save();
      // trả data từ sever về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: content
      });
    });
  });
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