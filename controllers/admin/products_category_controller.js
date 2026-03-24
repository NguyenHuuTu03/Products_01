const {
  deleteModel
} = require("mongoose");
const systemConfig = require("../../config/system");
const ProductsCategory = require("../../models/products_category.model");
const createTreeHelper = require("../../helpers/create-tree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await ProductsCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products_category/index.pug", {
    pageTitle: "Danh sách danh mục",
    records: newRecords
  })
}
// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };
  const records = await ProductsCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  // console.log(newRecords);
  res.render("admin/pages/products_category/create.pug", {
    pageTitle: "Thêm danh mục",
    records: newRecords
  })
}
// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  console.log(req.body);
  if (req.body.position == "") {
    const count = await ProductsCategory.countDocuments();
    req.body.position = count + 1;
  } else
    req.body.position = parseInt(req.body.position);
  const records = new ProductsCategory(req.body); // tạomới một sản phẩm (dữ liệu truyền vào là một object)
  await records.save(); // lưu vào DB
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}