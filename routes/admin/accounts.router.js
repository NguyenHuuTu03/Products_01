const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controllers");
const multer = require('multer');
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const accountValidate = require("../../validates/admin/account.validate");


router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", upload.single('avatar'), uploadCloud.upload, accountValidate.createPost, controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single('avatar'), uploadCloud.upload, accountValidate.editPatch, controller.editPatch);
module.exports = router;