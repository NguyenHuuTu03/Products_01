const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: String,
  products: [{
    product_id: String,
    quantity: Number
  }]
}, {
  timestamps: true // thêm vào để tạo thêm trường createAt và updateAt trong DB
});

const Cart = mongoose.model("Cart", cartSchema, "carts"); //- tạo model (cú pháp gồm (tên model, Schema, tên collection trong DB))
module.exports = Cart;