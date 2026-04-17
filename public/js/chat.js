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