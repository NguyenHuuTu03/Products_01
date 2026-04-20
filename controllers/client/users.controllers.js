const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {

  // Socket
  usersSocket(res)
  // End Socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId
  });
  const requestFriend = myUser.requestFriends;
  const acceptFriend = myUser.requestFriends;

  const users = await User.find({
    $and: [{
        _id: {
          $ne: userId // Ngoại trừ chính mình
        }
      },
      {
        _id: {
          $nin: requestFriend // k có trong mảng requestFriend
        }
      },
      {
        _id: {
          $nin: acceptFriend // k có trong mảng acceptFriend
        }
      }
    ],
    status: "active",
    deleted: false
  });
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
}