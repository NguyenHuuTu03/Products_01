const Cart = require("../../models/cart.model");
const Product = require("../../models/productModel");
const productsHelper = require("../../helpers/products");
const Order = require("../../models/orders.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  for (const item of cart.products) {
    const productInfo = await Product.findOne({
      _id: item.product_id
    }).select("title thumbnail price discountPercentage");
    item.productInfo = productInfo;
    item.priceNew = productsHelper.priceNew(productInfo);
    item.totalPrice = item.quantity * item.priceNew;
  }
  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
  res.render("client/pages/checkout/index.pug", {
    pageTitle: "Trang đặt hàng",
    cartDetail: cart
  });
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const objectInfo = req.body;
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = [];
  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity
    }
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("price discountPercentage")
    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;
    products.push(objectProduct);
  }
  const objectOrder = {
    cart_id: cartId,
    userInfo: objectInfo,
    products: products
  }

  // xoá hết các sản phẩm trong giỏ trước khi lưu vào order
  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  });
  const order = new Order(objectOrder);
  order.save();
  res.redirect(`/checkout/success/${order.id}`);
}

module.exports.orderSuccess = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId
  });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("title thumbnail");
    product.productInfo = productInfo
    product.priceNew = productsHelper.priceNew(product);
    product.totalPrice = product.priceNew * product.quantity;
  }
  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/success.pug", {
    pageTitle: "Order Success",
    order: order
  });
}