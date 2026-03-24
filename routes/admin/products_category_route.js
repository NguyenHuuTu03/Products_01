const express = require("express");
const validate = require("../../validates/admin/product_category.validate");
const multer = require('multer');
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();

const router = express.Router();
const controller = require("../../controllers/admin/products_category_controller");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", upload.single('thumbnail'), uploadCloud.upload, validate.validatePost, controller.createPost);
module.exports = router;