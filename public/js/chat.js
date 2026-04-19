import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//CLIENT_SEND_MESSAGE
const formSendMessage = document.querySelector(".chat .inner-form");
if (formSendMessage) {
  formSendMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.messageInput.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      content = ""
    }

  });
}
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector("#chatBody");

  const div = document.createElement("div");
  let htmlFullName = "";
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});
// END SERVER_RETURN_MESSAGE

// SCROLL_TO_BOTTOM
const bodyScroll = document.querySelector("#chatBody");
if (bodyScroll) {
  bodyScroll.scrollTop = bodyScroll.scrollHeight;
}

// END SCROLL_TO_BOTTOM

// EMOJI PICKER
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle('shown');
  });
}
// END EMOJI PICKER

// show typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
}
// End show typing


// Insert icon to input
const emojiPicker = document.querySelector("emoji-picker");


if (emojiPicker) {
  const inputChat = document.querySelector("#messageInput");
  emojiPicker.addEventListener("emoji-click", (e) => {
    const icon = e.detail.unicode;
    inputChat.value = inputChat.value + icon;
    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();
    showTyping();


  });

  // show typing
  var timeOut;

  inputChat.addEventListener("keyup", () => {
    showTyping();
  });
  // end show typing

}
// End Insert icon to input

// SERVER_RETURN_TYPING
const listTyping = document.querySelector(".inner-list-typing");
if (listTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const exitTyping = listTyping.querySelector(`[user-id="${data.userId}"]`);
      const body = document.querySelector("#chatBody");
      if (!exitTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots"> 
            <span> </span>
            <span> </span>
            <span> </span>
          </div>
        `;
        listTyping.appendChild(boxTyping);
        body.scrollTop = body.scrollHeight;
      }
    } else {
      const boxTypingRemove = listTyping.querySelector(`[user-id="${data.userId}"]`);
      if (boxTypingRemove) {
        listTyping.removeChild(boxTypingRemove);
      }
    }
  });
}

// END SERVER_RETURN_TYPING