const express = require("express");
const router = express.Router();
const chatMiddleware = require("../../middlewares/client/chat.middleware");


const controller = require("../../controllers/client/chat.controllers");
router.get("/chat-group/:roomChatId", chatMiddleware.isAccess("group"), controller.chatGroup);
router.get("/:roomChatId", chatMiddleware.isAccess("friend"), controller.index);

module.exports = router;