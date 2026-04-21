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
  const acceptFriend = myUser.acceptFriends;
  const listFriend = [];
  for (const friend of myUser.listFriends) {
    listFriend.push(friend.user_id);
  }


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
      },
      {
        _id: {
          $nin: listFriend // k có trong mảng listFriend
        }
      }
    ],
    status: "active",
    deleted: false
  }).select("id avatar fullName");
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
    countFriend: {
      lengthAcceptFriend: myUser.acceptFriends.length,
      lengthRequestFriend: myUser.requestFriends.length,
      lengthFriend: myUser.listFriends.length
    }
  });
}
// [GET] /users/request
module.exports.request = async (req, res) => {

  //   // Socket
  usersSocket(res)
  //   // End Socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId
  });
  const requestFriend = myUser.requestFriends;

  const users = await User.find({
    _id: {
      $in: requestFriend
    },
    status: "active",
    deleted: false
  }).select("id avatar fullName");
  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users,
    countFriend: {
      lengthAcceptFriend: myUser.acceptFriends.length,
      lengthRequestFriend: myUser.requestFriends.length,
      lengthFriend: myUser.listFriends.length
    }
  });
}
// [GET] /users/accept
module.exports.accept = async (req, res) => {

  //   // Socket
  usersSocket(res)
  //   // End Socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId
  });
  const acceptFriend = myUser.acceptFriends;

  const users = await User.find({
    _id: {
      $in: acceptFriend
    },
    status: "active",
    deleted: false
  }).select("id avatar fullName");
  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời kết bạn",
    users: users,
    countFriend: {
      lengthAcceptFriend: myUser.acceptFriends.length,
      lengthRequestFriend: myUser.requestFriends.length,
      lengthFriend: myUser.listFriends.length
    }
  });
}
// [GET] /users/friends
module.exports.friends = async (req, res) => {

  //   // Socket
  usersSocket(res)
  //   // End Socket

  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId
  });
  let listFriend = [];
  for (const friend of myUser.listFriends) {
    listFriend.push(friend.user_id);
  }

  const users = await User.find({
    _id: {
      $in: listFriend
    },
    status: "active",
    deleted: false
  }).select("id avatar fullName statusOnline");
  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users,
    countFriend: {
      lengthAcceptFriend: myUser.acceptFriends.length,
      lengthRequestFriend: myUser.requestFriends.length,
      lengthFriend: myUser.listFriends.length
    }
  });
}