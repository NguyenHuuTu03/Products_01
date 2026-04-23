const RoomChat = require("../../models/room-chat.model");

module.exports.isAccess = (typeRoom) => {
  return async (req, res, next) => {
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;

    const roomChat = await RoomChat.findOne({
      _id: roomChatId,
      "users.user_id": userId,
      deleted: false
    });

    // ❌ không có phòng hoặc không thuộc phòng
    if (!roomChat) {
      return res.redirect("/");
    }

    // ❌ sai loại phòng
    if (typeRoom && roomChat.typeRoom !== typeRoom) {
      return res.redirect("/");
    }

    // ✅ hợp lệ
    req.roomChat = roomChat;
    next();
  };
};