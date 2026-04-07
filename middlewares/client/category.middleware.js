const ProductsCategory = require("../../models/products_category.model");
const createTreeHelper = require("../../helpers/create-tree");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductsCategory.find({
    deleted: false
  });
  const newProductsCategory = await createTreeHelper.tree(productsCategory);
  // console.log(newProductsCategory);
  res.locals.layoutProductCategory = newProductsCategory;
  next();
}