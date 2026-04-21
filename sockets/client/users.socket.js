const User = require("../../models/user.model");

module.exports = (res) => {



  _io.once("connection", (socket) => {
    const myId = res.locals.user.id;
    // Chức năng gửi yêu cầu
    socket.on("CLIENT_ADD_FRIEND", async (youId) => {

      const exitsMyinYou = await User.findOne({
        _id: youId,
        acceptFriends: myId
      });
      if (!exitsMyinYou) {

        // thêm id của my vào acceptFriend của you
        await User.updateOne({
          _id: youId
        }, {
          $push: {
            acceptFriends: myId
          }
        });

      }

      const exitsYouinMy = await User.findOne({
        _id: myId,
        requestFriends: youId
      });
      if (!exitsYouinMy) {

        // thêm id của you vào requestFriend của my
        await User.updateOne({
          _id: myId
        }, {
          $push: {
            requestFriends: youId
          }
        });

      }

      // Lấy số lượng lời mời trong acceptFriend của You
      const youUser = await User.findOne({
        _id: youId
      });
      const lengthAcceptFriend = youUser.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: youId,
        lengthAcceptFriend: lengthAcceptFriend
      });

      // Lấy thông tin my user để hiển thị trong you
      const myUser = await User.findOne({
        _id: myId
      }).select("id avatar fullName requestFriends");
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: youId,
        infoUser: myUser
      });

      // lấy số lượng lời mời đã gửi trong requestFriend của My
      const lengthRequestFriend = myUser.requestFriends.length;
      socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
        lengthRequestFriend: lengthRequestFriend
      });
    });
    // Hết Chức năng gửi yêu cầu

    // Chức năng huỷ gửi yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (youId) => {
      const myId = res.locals.user.id;
      const exitsMyinYou = await User.findOne({
        _id: youId,
        acceptFriends: myId
      });
      if (exitsMyinYou) {

        // xoá id của my trong acceptFriend của you
        await User.updateOne({
          _id: youId
        }, {
          $pull: {
            acceptFriends: myId
          }
        });

      }

      const exitsYouinMy = await User.findOne({
        _id: myId,
        requestFriends: youId
      });
      if (exitsYouinMy) {

        // xoá id của you trong requestFriend của my
        await User.updateOne({
          _id: myId
        }, {
          $pull: {
            requestFriends: youId
          }
        });

      }

      // Lấy số lượng lời mời trong acceptFriend của You
      const youUser = await User.findOne({
        _id: youId
      });
      const lengthAcceptFriend = youUser.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: youId,
        lengthAcceptFriend: lengthAcceptFriend
      });

      // lấy số lượng lời mời đã gửi trong requestFriend của My
      const myUser = await User.findOne({
        _id: myId
      });
      const lengthRequestFriend = myUser.requestFriends.length;
      socket.emit("SERVER_RETURN_LENGTH_REQUEST_FRIEND", {
        lengthRequestFriend: lengthRequestFriend
      });

      // lấy id của user my 
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        myId: myId,
        youId: youId
      });
    });
    // Hết Chức năng huỷ gửi yêu cầu

    // Chức năng không chấp nhận yêu cầu
    socket.on("CLIENT_REFUSE_FRIEND", async (youId) => {

      const exitsMyinYou = await User.findOne({
        _id: myId,
        acceptFriends: youId
      });
      if (exitsMyinYou) {

        // xoá id của my trong acceptFriend của you
        await User.updateOne({
          _id: myId
        }, {
          $pull: {
            acceptFriends: youId
          }
        });

      }

      const exitsYouinMy = await User.findOne({
        _id: youId,
        requestFriends: myId
      });
      if (exitsYouinMy) {

        // xoá id của you trong requestFriend của my
        await User.updateOne({
          _id: youId
        }, {
          $pull: {
            requestFriends: myId
          }
        });

      }
    });
    // Hết Chức năng không chấp nhận yêu cầu

    // Chức năng chấp nhận yêu cầu
    socket.on("CLIENT_ACCEPT_FRIEND", async (youId) => {

      const exitsMyinYou = await User.findOne({
        _id: myId,
        acceptFriends: youId
      });
      if (exitsMyinYou) {

        // xoá id của my trong acceptFriend của you
        await User.updateOne({
          _id: myId
        }, {
          $push: {
            listFriends: {
              user_id: youId,
              chat_room_id: ""
            }
          },
          $pull: {
            acceptFriends: youId
          }
        });

      }

      const exitsYouinMy = await User.findOne({
        _id: youId,
        requestFriends: myId
      });
      if (exitsYouinMy) {

        // xoá id của you trong requestFriend của my
        await User.updateOne({
          _id: youId
        }, {
          $push: {
            listFriends: {
              user_id: myId,
              chat_room_id: ""
            }
          },
          $pull: {
            requestFriends: myId
          }
        });

        // lấy số lượng listFriend trong My và You
        const myUser = await User.findOne({
          _id: myId
        });
        _io.emit("SERVER_RETURN_LENGTH_FRIEND", {
          lengthMyFriend: myUser.listFriends.length
        });
      }
    });
    // Hết Chức năng chấp nhận yêu cầu
  });
}