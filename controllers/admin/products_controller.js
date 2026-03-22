// [GET] /admin/products

const Products = require("../../models/productModel");

const filtersStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

module.exports.products = async (req, res) => {
  // bộ lọc
  const filtersStatus = filtersStatusHelper(req.query);
  let find = {
    deleted: false
  };
  console.log(req.query.status);
  if (req.query.status) { // req.query là để lấy ra các params sau dấu hỏi chấm trên url
    find.status = req.query.status;
  }
  // tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // phân trang (pagination)
  const countProducts = await Products.countDocuments(find); // dùng để đếm số lượng các sản phẩm lấy được
  const objectPagination = paginationHelper({
      currentPage: 1,
      limitItem: 4
    },
    req.query,
    countProducts
  );
  // end pagination
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  const products = await Products.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  console.log(products)
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filtersStatus: filtersStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  })
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

  const status = req.params.status;
  const id = req.params.id;
  await Products.updateOne({
    _id: id
  }, {
    status: status
  });

  req.flash('success', 'Cập nhật trạng thái thành công!');
  res.redirect(req.get("Referrer"));
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await Products.updateMany({
        _id: {
          $in: ids
        }

      }, {
        status: "active"
      });
      req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
      break;
    case "inactive":
      await Products.updateMany({
        _id: {
          $in: ids
        }

      }, {
        status: "inactive"
      });
      req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
      break;
    case "delete-all":
      await Products.updateMany({
        _id: {
          $in: ids
        }

      }, {
        deleted: true,
        deletedAt: new Date(),
      });
      req.flash('success', `Đã xoá thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        await Products.updateOne({
          _id: id
        }, {
          position: position
        });
      }
      req.flash('success', `Cập nhật vị trí thành công ${ids.length} sản phẩm`);
      break;
    default:
      break;
  }


  res.redirect(req.get("Referrer"));
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Products.deleteOne({
  //   _id: id
  // }); // xoá vĩnh viễn

  await Products.updateOne({
    _id: id
  }, {
    deleted: true,
    deletedAt: new Date()
  });
  req.flash('success', 'Đã xoá thành công!');
  res.redirect(req.get("Referrer"));
}

// Create Product
// [GET] /admin/products/create 
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm mới sản phẩm"
  });
}

// [POST] /admin/products/create 
module.exports.createPost = async (req, res) => {
  // console.log(req.file); 

  req.body.price = parseInt(req.body.price); // req.body để lấy được dữ liệu mà ta gửi từ form lên server
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Products.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const product = new Products(req.body); // tạo mới một sản phẩm (dữ liệu truyền vào là một object)
  product.save(); // lưu vào DB
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}
// End Create Product

// Edit Product
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Products.findOne(find);
    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Cập nhật sản phẩm",
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price); // req.body để lấy được dữ liệu mà ta gửi từ form lên server
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  const id = req.params.id;
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  try {
    await Products.updateOne({
      _id: id
    }, req.body);
    req.flash("success", "Cập nhật thành công!");

  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect(req.get("Referrer"));
}
// End Edit Product

// Detail Product
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Products.findOne(find);
    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
// End Detail Product