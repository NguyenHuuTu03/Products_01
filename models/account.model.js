const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  role_id: String,
  token: {
    type: String,
    default: generate.generateRandomString(20)
  },
  phone: String,
  avatar: String,
  status: String,
  deleted: {
    type: Boolean,
    default: false // để mỗi khi thêm sản phẩm vào DB mà không có trường deleted thì nó mặc định là false
  },
  deletedAt: Date,

}, {
  timestamps: true // thêm vào để tạo thêm trường createAt và updateAt trong DB
});

const Account = mongoose.model("Account", accountSchema, "accounts"); //- tạo model (cú pháp gồm (tên model, Schema, tên collection trong DB))
module.exports = Account;