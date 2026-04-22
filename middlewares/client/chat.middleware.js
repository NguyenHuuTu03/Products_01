const RoomChat = require("../../models/room-chat.model");

module.exports.isAccess = async (req, res, next) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;

  // tìm room chat để kiểm tra user có trong room đó k
  const exitsUserinRoomChat = await RoomChat.findOne({
    _id: roomChatId,
    "users.user_id": userId, // sử dụng cú pháp moongose
    deleted: false
  });

  // hoặc duyệt qua các users trong room chat để kiểm tra user đó có trong room k 
  // const checkUser = exitsUserinRoomChat.users.find(user => user.user_id == userId);
  // if (!checkUser) {
  //   res.redirect("/");
  // } else {
  //   next();
  // }

  if (exitsUserinRoomChat) {
    next();
  } else {
    res.redirect("/");
  }

}