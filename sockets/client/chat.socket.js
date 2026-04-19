const Chats = require("../../models/chat.models");
const uploadCloudinaryHelper = require("../../helpers/uploadCloudinary");

module.exports = (res) => {

  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once('connection', (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {

      let images = [];
      for (const imageBuffer of data.images) {
        const link = await uploadCloudinaryHelper(imageBuffer);
        images.push(link);
      }
      // lưu data vào db
      const chat = new Chats({
        user_id: userId,
        content: data.content,
        images: images
      });
      await chat.save();
      // trả data về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images
      });
    });

    // Typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type
      });
    });
    // End Typing
  });
}