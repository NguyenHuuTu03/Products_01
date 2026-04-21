// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      const youId = button.getAttribute("btn-add-friend");
      const boxUser = button.closest(".box-user");
      boxUser.classList.add("add");
      socket.emit("CLIENT_ADD_FRIEND", youId);
    });
  });
}
// Hết Chức năng gửi yêu cầu

// Chức năng huỷ gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      const youId = button.getAttribute("btn-cancel-friend");
      button.closest(".box-user").classList.remove("add");
      socket.emit("CLIENT_CANCEL_FRIEND", youId);
    });
  });
}
// Hết Chức năng huỷ gửi yêu cầu

// Chức năng không chấp nhận 
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button => {
    button.addEventListener("click", () => {
      const youId = button.getAttribute("btn-refuse-friend");
      button.closest(".box-user").classList.add("refuse");
      socket.emit("CLIENT_REFUSE_FRIEND", youId);
    });
  });
}
// Hết Chức năng không chấp nhận 

// Chức năng chấp nhận 
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    button.addEventListener("click", () => {
      const youId = button.getAttribute("btn-accept-friend");
      button.closest(".box-user").classList.add("accepted");
      socket.emit("CLIENT_ACCEPT_FRIEND", youId);
    });
  });
}
// Hết Chức năng  chấp nhận 

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeLengthAccept = document.querySelector("[badge-length-accept]");
if (badgeLengthAccept) {
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    const youId = badgeLengthAccept.getAttribute("badge-length-accept");
    if (youId === data.userId) {
      badgeLengthAccept.innerHTML = data.lengthAcceptFriend;
    }
  });
}
// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND