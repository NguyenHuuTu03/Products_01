const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: ""
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  deleted: {
    type: Boolean,
    default: false // để mỗi khi thêm sản phẩm vào DB mà không có trường deleted thì nó mặc định là false
  },
  deletedAt: Date,
  slug: {
    type: String,
    slug: "title",
    unique: true // để slug là duy nhất(k bị trùng)
  }

}, {
  timestamps: true // thêm vào để tạo thêm trường createAt và updateAt trong DB
});

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category"); //- tạo model (cú pháp gồm (tên model, Schema, tên collection trong DB))
module.exports = ProductCategory;