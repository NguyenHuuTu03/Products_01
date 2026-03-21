const dashboardRoute = require("./dashboard_route");
const productRoute = require("./products_route");
const systemConfig = require("../../config/system");
module.exports = (app) => {
  const path_admin = systemConfig.prefixAdmin;
  app.use(path_admin + "/dashboard", dashboardRoute);
  app.use(path_admin + "/products", productRoute);
}