const User = require("../../models/user.model");

module.exports = (res) => {

  const myId = res.locals.user.id;

  _io.once("connection", (socket) => {

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
    });
    // Hết Chức năng gửi yêu cầu

    // Chức năng huỷ gửi yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (youId) => {

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
    });
    // Hết Chức năng huỷ gửi yêu cầu
  });
}