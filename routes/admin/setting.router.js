const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/setting.controllers");
const multer = require('multer');
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const settingGeneralValidate = require("../../validates/admin/setting.validate");

router.get("/general", controller.general);
router.patch("/general", upload.single('logo'), uploadCloud.upload, settingGeneralValidate.generalPatch, controller.generalPatch);
module.exports = router;