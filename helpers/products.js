module.exports.priceNewProduct = (products) => {
  const newProducts = products.map(item => {
    item.price_new = (item.price * (100 - item.discountPercentage) / 100).toFixed();
    return item;
  });
  return newProducts;
}
module.exports.priceNew = (product) => {
  const price_new = (product.price * (100 - product.discountPercentage) / 100).toFixed();
  return parseInt(price_new);
}