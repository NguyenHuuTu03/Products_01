const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: {
    type: String,
    default: ""
  },
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  deleted: {
    type: Boolean,
    default: false // để mỗi khi thêm sản phẩm vào DB mà không có trường deleted thì nó mặc định là false
  },
  // deletedAt: Date,
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: [{
    account_id: String,
    updatedAt: Date
  }],
  slug: {
    type: String,
    slug: "title",
    unique: true // để slug là duy nhất(k bị trùng)
  }

}, {
  timestamps: true // thêm vào để tạo thêm trường createAt và updateAt trong DB
});

const Product = mongoose.model("Product", productSchema, "products"); //- tạo model (cú pháp gồm (tên model, Schema, tên collection trong DB))
module.exports = Product;