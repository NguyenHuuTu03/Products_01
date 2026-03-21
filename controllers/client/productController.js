// [GET] /products

const Products = require("../../models/productModel");

module.exports.index = async (req, res) => {
  const products = await Products.find({
    status: "active",
    deleted: false
  }).sort({
    position: "desc"
  });
  console.log(products);
  const newProducts = products.map(item => {
    item.price_new = (item.price * (100 - item.discountPercentage) / 100).toFixed();
    return item;
  })
  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts
  });
}

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      status: "active",
      slug: req.params.slug
    }
    const product = await Products.findOne(find);
    if (!product) {
      // req.flash("error", "Không tìm thấy dữ liệu");
      return res.redirect("/products");
    }
    res.render("client/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    })
  } catch (error) {
    res.redirect("/products");
  }

}