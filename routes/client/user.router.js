const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controllers");
const userValidate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");

const multer = require('multer');
const upload = multer();
const uploadCloudMiddleware = require('../../middlewares/client/uploadCloud.middleware')



router.get("/register", controller.register);
router.post("/register", userValidate.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", userValidate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", userValidate.forgotPasswordPost, controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", userValidate.otpPasswordPost, controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", userValidate.resetPasswordPost, controller.resetPasswordPost);
router.get("/info", authMiddleware.requireAuth, controller.info);
router.get("/info/edit", upload.single('avatar'), uploadCloudMiddleware.upload, authMiddleware.requireAuth, controller.infoEdit);
router.post("/info/edit", upload.single('avatar'), uploadCloudMiddleware.upload, authMiddleware.requireAuth, controller.infoEditPost);
module.exports = router;