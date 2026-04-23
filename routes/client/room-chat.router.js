const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/room-chat.controllers");
const roomChatValidate = require("../../validates/client/rooms-chat.validate");

const multer = require('multer');
const upload = multer();
const uploadCloudMiddleware = require('../../middlewares/client/uploadCloud.middleware')

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create', upload.single('avatar'), uploadCloudMiddleware.upload, roomChatValidate.createPost, controller.createPost);
module.exports = router;