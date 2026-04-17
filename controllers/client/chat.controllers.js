const Chats = require("../../models/chat.models");
const User = require("../../models/user.model");

// [GET] /chat
module.exports.index = async (req, res) => {
  const user_id = res.locals.user.id;
  _io.once('connection', (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chats({
        user_id: user_id,
        content: content
      });
      await chat.save();
    });
  });
  const chats = await Chats.find({});
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