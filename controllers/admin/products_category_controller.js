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
  try {
    console.log(req.body);
    if (req.body.position == "") {
      const count = await ProductsCategory.countDocuments();
      req.body.position = count + 1;
    } else
      req.body.position = parseInt(req.body.position);
    const records = new ProductsCategory(req.body); // tạomới một sản phẩm (dữ liệu truyền vào là một object)
    await records.save(); // lưu vào DB
    req.flash("success", "Thêm danh mục thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    req.flash("error", "Thêm danh mục thất bại");
  }
}
// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductsCategory.findOne({
      _id: id,
      deleted: false
    });
    const records = await ProductsCategory.find({
      deleted: false
    });
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/pages/products_category/edit.pug", {
      pageTitle: "Chỉnh sửa danh mục",
      data: data,
      records: newRecords
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.body.position == "") {
      const count = await ProductsCategory.countDocuments();
      req.body.position = count + 1;
    } else
      req.body.position = parseInt(req.body.position);
    await ProductsCategory.updateOne({
      _id: id
    }, req.body);
    req.flash("success", "Cập nhật danh mục thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Cập nhật danh mục thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}