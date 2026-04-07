const productRoutes = require("./product_route");
const homeRoutes = require("./home_route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use("/", homeRoutes);

  app.use("/products", productRoutes);
}