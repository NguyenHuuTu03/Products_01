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

// hàm xử lý nút không chấp nhận yêu cầu
const buttonRefuseFriend = (button) => {
  button.addEventListener("click", () => {
    const youId = button.getAttribute("btn-refuse-friend");
    button.closest(".box-user").classList.add("refuse");
    socket.emit("CLIENT_REFUSE_FRIEND", youId);
  });
}
// Hết hàm xử lý nút không chấp nhận yêu cầu


// hàm xử lý nút chấp nhận yêu cầu
const buttonAcceptFriend = (button) => {
  button.addEventListener("click", () => {
    const youId = button.getAttribute("btn-accept-friend");
    button.closest(".box-user").classList.add("accepted");
    socket.emit("CLIENT_ACCEPT_FRIEND", youId);
  });
}
// Hết hàm xử lý nút chấp nhận yêu cầu


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
    buttonRefuseFriend(button);
  });
}
// Hết Chức năng không chấp nhận 

// Chức năng chấp nhận 
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach(button => {
    buttonAcceptFriend(button);
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

// SERVER_RETURN_LENGTH_REQUEST_FRIEND
const badgeLengthRequest = document.querySelector("[badge-length-request]");
if (badgeLengthRequest) {
  socket.on("SERVER_RETURN_LENGTH_REQUEST_FRIEND", (data) => {
    badgeLengthRequest.innerHTML = data.lengthRequestFriend;
  })
}
// End SERVER_RETURN_LENGTH_REQUEST_FRIEND

// SERVER_RETURN_LENGTH_FRIEND
const badgeLengthFriend = document.querySelector("[badge-length-friend]");
if (badgeLengthFriend) {
  socket.on("SERVER_RETURN_LENGTH_FRIEND", (data) => {
    badgeLengthFriend.innerHTML = data.lengthMyFriend;
  });
}
// End SERVER_RETURN_LENGTH_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {

  // Trang lời mời kết bạn
  const boxInfoUser = document.querySelector("[data-user-accept]");
  if (boxInfoUser) {
    const youId = boxInfoUser.getAttribute("data-user-accept");
    if (youId === data.userId) {

      // vẽ giao diện 
      const div = document.createElement("div");
      div.classList.add("col-9", "mb-2");
      div.setAttribute("user-id", data.infoUser._id);
      div.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src=${data.infoUser.avatar ? data.infoUser.avatar : "/images/avatar.png"},
                alt=${data.infoUser.fullName}>
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUser.fullName}</div>
            <div class="inner-buttons">
              <button class="btn btn-sm btn-primary me-1" btn-accept-friend="${data.infoUser._id}">
                Chấp nhận
              </button>
              <button class="btn btn-sm btn-secondary me-1" btn-refuse-friend="${data.infoUser._id}">
                Xoá
              </button>
            </div>
          </div>
        </div>
      `;
      boxInfoUser.appendChild(div);
      // hết vẽ giao diện 

      // xử lý nút không chấp nhận
      const BtnRefuseFriend = div.querySelector("[btn-refuse-friend]");
      buttonRefuseFriend(BtnRefuseFriend);
      // hết xử lý nút không chấp nhận

      // xử lý nút chấp nhận
      const BtnAcceptFriend = div.querySelector("[btn-accept-friend]");
      buttonAcceptFriend(BtnAcceptFriend);
      // hết xử lý nút chấp nhận
    }
  }

  // Trang danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-user-notFriend]");
  if (dataUserNotFriend) {
    const youId = dataUserNotFriend.getAttribute("data-user-notFriend");
    if (youId === data.userId) {
      const boxUserRemove = dataUserNotFriend.querySelector(`[user-id="${data.infoUser._id}"]`);
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});

// END SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const boxUserRemove = document.querySelector(`[user-id="${data.myId}"]`);
  if (boxUserRemove) {
    const dataUserAccept = document.querySelector("[data-user-accept]");
    const youId = dataUserAccept.getAttribute("data-user-accept");
    if (youId === data.youId) {
      dataUserAccept.removeChild(boxUserRemove);
    }
  }

});
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND