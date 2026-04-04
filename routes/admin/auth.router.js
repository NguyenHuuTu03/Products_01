const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controllers");
const authValidate = require("../../validates/admin/login.validates");


router.get("/login", controller.login);
router.post("/login", authValidate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
module.exports = router;