const Products = require("../../models/productModel");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
    status: "active",
    featured: "1"
  };
  const productsFeatured = await Products.find(find).sort({
    position: "desc"
  }).limit(6);
  const newProductsFeatured = productsHelper.priceNewProduct(productsFeatured);
  const find1 = {
    deleted: false,
    status: "active"
  };
  const newProducts = await Products.find(find1).sort({
    position: "desc"
  }).limit(6);
  const newProductNews = productsHelper.priceNewProduct(newProducts);
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    newProducts: newProductNews
  });
};