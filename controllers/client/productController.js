const productsHelper = require("../../helpers/products");
const productsCategory = require("../../models/products_category.model");
const productCategoryHelper = require("../../helpers/product-category");

// [GET] /products
const Products = require("../../models/productModel");
const ProductCategory = require("../../models/products_category.model");

module.exports.index = async (req, res) => {
  const products = await Products.find({
    status: "active",
    deleted: false
  }).sort({
    position: "desc"
  });


  const newProducts = productsHelper.priceNewProduct(products);
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
      slug: req.params.slugProduct
    }
    const product = await Products.findOne(find);

    if (product.product_category_id) {
      const category = await productsCategory.findOne({
        deleted: false,
        status: "active",
        _id: product.product_category_id
      });
      product.category = category;

    }
    product.price_new = productsHelper.priceNew(product);
    // if (!product) {
    //   // req.flash("error", "Không tìm thấy dữ liệu");
    //   return res.redirect("/products");
    // }
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    res.redirect("/products");
  }

}

module.exports.category = async (req, res) => {
  const category = await productsCategory.findOne({
    deleted: false,
    status: "active",
    slug: req.params.slugCategory
  });

  const listCategory = await productCategoryHelper.getSubCategory(category.id);
  const listIdCategory = listCategory.map(item => item.id);
  const products = await Products.find({
    deleted: false,
    status: "active",
    product_category_id: {
      $in: [category.id, ...listIdCategory]
    }
  }).sort({
    position: "desc"
  });
  const newProducts = productsHelper.priceNewProduct(products);
  res.render("client/pages/products/index.pug", {
    pageTitle: category.title,
    products: newProducts
  });
}