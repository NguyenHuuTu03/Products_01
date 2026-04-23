const RoomChat = require('../../models/room-chat.model');
const User = require('../../models/user.model');

// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const myId = res.locals.user.id;
  const roomsChat = await RoomChat.find({
    typeRoom: "group",
    deleted: false,
    "users.user_id": myId
  });
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng chat",
    rooms: roomsChat
  });


}
// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const listFriend = res.locals.user.listFriends;

  for (const friend of listFriend) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      deleted: false
    }).select("avatar fullName");
    friend.infoFriend = infoFriend;
  }
  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng chat",
    listFriend: listFriend
  });
}
// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const members = req.body.members;
  const dataRoom = {
    title: req.body.nameRoomChat,
    avatar: req.body.avatar,
    typeRoom: "group",
    users: []
  };
  for (const member of members) {
    dataRoom.users.push({
      user_id: member,
      role: "User"
    })
  }
  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "Admin Super"
  })
  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();
  res.redirect(`/chat/chat-group/${roomChat.id}`);
}