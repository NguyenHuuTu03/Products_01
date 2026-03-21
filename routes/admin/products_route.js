const express = require("express");

const validate = require("../../validates/admin/product_validate");
const multer = require('multer');
const storageMulter = require("../../helpers/storageMulter");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const upload = multer();

const router = express.Router();
const controller = require("../../controllers/admin/products_controller");
router.get("/", controller.products);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post("/create", upload.single('thumbnail'), uploadCloud.upload, validate.validatePost, controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single('thumbnail'), validate.validatePost, controller.editPatch);
router.get("/detail/:id", controller.detail);
module.exports = router;