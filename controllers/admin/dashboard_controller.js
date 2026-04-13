const Products = require("../../models/productModel");
const Users = require("../../models/user.model");
const Orders = require("../../models/orders.model");
const productsHelper = require("../../helpers/products");

module.exports.dashboard = async (req, res) => {
  const stats = {
    products: {
      total: 0
    },
    users: {
      total: 0
    },
    orders: {
      total: 0,
      totalRevenue: 0
    }
  };

  stats.products.total = await Products.countDocuments();
  stats.users.total = await Users.countDocuments();
  stats.orders.total = await Orders.countDocuments();

  const orders = await Orders.find({});

  // ===== TÍNH DOANH THU =====
  for (const order of orders) {
    for (const product of order.products) {
      product.priceNew = productsHelper.priceNew(product);
      product.totalPrice = product.priceNew * product.quantity;
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  stats.orders.totalRevenue = orders.reduce((sum, item) => sum + item.totalPrice, 0);

  // ===== DOANH THU THEO THÁNG =====
  const revenueByMonth = Array(12).fill(0);

  for (const order of orders) {
    if (!order.createdAt) continue;
    const month = new Date(order.createdAt).getMonth();
    revenueByMonth[month] += order.totalPrice;
  }

  // ===== TOP SẢN PHẨM =====
  const productMap = {};

  for (const order of orders) {
    for (const item of order.products) {
      const id = item.product_id;
      if (!productMap[id]) productMap[id] = 0;
      productMap[id] += item.quantity;
    }
  }

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const productLabels = [];
  const productData = [];

  for (const [productId, quantity] of topProducts) {
    const product = await Products.findById(productId);
    if (product) {
      productLabels.push(product.title);
      productData.push(quantity);
    }
  }

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Tổng quan",
    stats,
    revenueData: revenueByMonth,
    productLabels: productLabels,
    productData: productData
  });
};