const Cart = require('../../models/cart.model');
const Product = require("../../models/productModel");
const productsHelper = require("../../helpers/products");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  for (const item of cart.products) {
    const productId = item.product_id;
    const quantity = item.quantity;
    const productInfo = await Product.findOne({
      _id: productId
    });
    item.productInfo = productInfo;
    item.priceNew = productsHelper.priceNew(productInfo);
    item.totalPrice = quantity * item.priceNew;
  }
  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart
  })
}
// [GET] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const exitProductInCart = cart.products.find(item => item.product_id == productId);
  if (exitProductInCart) {
    const newQuantity = quantity + exitProductInCart.quantity;
    await Cart.updateOne({
      _id: cartId,
      "products.product_id": productId
    }, {
      $set: {
        "products.$.quantity": newQuantity
      }
    });
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity
    }
    await Cart.updateOne({
      _id: cartId
    }, {
      $push: {
        products: objectCart
      }
    });
  }
  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");
  res.redirect(req.get("Referer"));
}
// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;
  await Cart.updateOne({
    _id: cartId
  }, {
    $pull: {
      products: {
        product_id: productId
      }
    }
  });
  req.flash("success", "Đã xoá sản phẩm khỏi giỏ hàng!");
  res.redirect(req.get("Referer"));
}
// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const productId = req.params.productId;
  const quantity = req.params.quantity;
  const cartId = req.cookies.cartId;
  await Cart.updateOne({
    _id: cartId,
    "products.product_id": productId
  }, {
    $set: {
      "products.$.quantity": quantity
    }
  });
  req.flash("success", "Đã cập nhật số lượng sản phẩm trong giỏ hàng!");
  res.redirect(req.get("Referer"));
}