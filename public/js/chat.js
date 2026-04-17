import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//CLIENT_SEND_MESSAGE
const formSendMessage = document.querySelector(".chat .inner-form");
if (formSendMessage) {
  formSendMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("CLIENT_SEND_MESSAGE", e.target.elements.messageInput.value);
    const input = formSendMessage.querySelector("input");
    input.value = "";
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
bodyScroll.scrollTop = bodyScroll.scrollHeight;
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

// Insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  emojiPicker.addEventListener("emoji-click", (e) => {
    const icon = e.detail.unicode;
    const input = document.querySelector("#messageInput");
    input.value = input.value + icon;
  });
}
// End Insert icon to input