const User = require("../../models/user.model");

module.exports = (res) => {

  const myId = res.locals.user.id;

  _io.once("connection", (socket) => {
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
  });
}