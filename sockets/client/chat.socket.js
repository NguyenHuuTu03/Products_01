const Chats = require("../../models/chat.models");
const uploadCloudinaryHelper = require("../../helpers/uploadCloudinary");

module.exports = (req, res) => {

  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;

  _io.once('connection', (socket) => {
    socket.join(roomChatId);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {

      let images = [];
      for (const imageBuffer of data.images) {
        const link = await uploadCloudinaryHelper(imageBuffer);
        images.push(link);
      }
      // lưu data vào db
      const chat = new Chats({
        room_chat_id: roomChatId,
        user_id: userId,
        content: data.content,
        images: images
      });
      await chat.save();
      // trả data về client
      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        message_id: chat.id,
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images
      });
    });
    // CLIENT_DELETE_MESSAGE
    socket.on("CLIENT_DELETE_MESSAGE", async (message_id) => {
      await Chats.deleteOne({
        _id: message_id
      });

      _io.to(roomChatId).emit("SERVER_DELETE_MESSAGE", message_id);
    });
    // END CLIENT_DELETE_MESSAGE
    // Typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      });
    });
    // End Typing
  });
}