const multer = require('multer');
const upload = multer();
const uploadCloudMiddleware = require('../../middlewares/admin/uploadCloud.middleware');

const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my_account.controllers");
router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch("/edit", upload.single('avatar'), uploadCloudMiddleware.upload, controller.editPatch);
module.exports = router;