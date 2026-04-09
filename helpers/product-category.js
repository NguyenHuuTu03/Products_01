const ProductCategory = require("../models/products_category.model");
module.exports.getSubCategory = (parentId) => {
  const getCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      deleted: false,
      status: "active",
      parent_id: parentId
    });
    let allSubs = [...subs];
    for (const sub of subs) {
      const childs = await getCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }
    return allSubs;
  }
  const result = getCategory(parentId);
  return result;
}