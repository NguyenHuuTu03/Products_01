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
  });
}