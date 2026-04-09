module.exports.priceNewProduct = (products) => {
  const newProducts = products.map(item => {
    item.price_new = (item.price * (100 - item.discountPercentage) / 100).toFixed();
    return item;
  });
  return newProducts;
}