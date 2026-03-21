const express = require("express");
const router = express.Router();
const controllers = require("../../controllers/client/productController");
router.get("/", controllers.index); // truyền vào 2 đối số là path(đường dẫn) và hàm xử lý request (controller) khi người dùng truy cập vào đường dẫn
router.get("/:slug", controllers.detail);
module.exports = router;