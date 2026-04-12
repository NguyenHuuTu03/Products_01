const productRoutes = require("./product_route");
const homeRoutes = require("./home_route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const searchRoutes = require("./search.router");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const cartRoutes = require("./cart.router");
const orderRoutes = require("./order.router");
const userRoutes = require("./user.router");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);

  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", orderRoutes);
  app.use("/user", userRoutes);
}