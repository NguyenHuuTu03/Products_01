const Products = require("../../models/productModel");
const productsHelper = require("../../helpers/products");

module.exports.search = async (req, res) => {
  const keyword = req.query.keyword;

  if (keyword) {
    const regex = new RegExp(keyword, "i");
    const products = await Products.find({
      title: regex,
      deleted: false,
      status: "active"
    });
    const newProducts = productsHelper.priceNewProduct(products);
    res.render("client/pages/search/index.pug", {
      pageTile: "Tìm kiếm sản phẩm",
      keyword: keyword,
      products: newProducts
    });
  }
}