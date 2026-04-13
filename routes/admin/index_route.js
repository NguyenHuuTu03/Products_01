const dashboardRoute = require("./dashboard_route");
const productRoute = require("./products_route");
const productsCategoryRoute = require("./products_category_route");
const systemConfig = require("../../config/system");
const roleRoute = require("./roles.router");
const accountRoute = require("./accounts.router");
const authRoute = require("./auth.router");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const myAccount = require("./my_account.router");
const settingRoute = require("./setting.router");


module.exports = (app) => {
  const path_admin = systemConfig.prefixAdmin;

  app.use(path_admin + "/dashboard", authMiddleware.requireAuth, dashboardRoute);
  app.use(path_admin + "/products", authMiddleware.requireAuth, productRoute);
  app.use(path_admin + "/products-category", authMiddleware.requireAuth, productsCategoryRoute);
  app.use(path_admin + "/roles", authMiddleware.requireAuth, roleRoute);
  app.use(path_admin + "/accounts", authMiddleware.requireAuth, accountRoute);
  app.use(path_admin + "/auth", authRoute);
  app.use(path_admin + "/my-account", authMiddleware.requireAuth, myAccount);
  app.use(path_admin + "/settings", authMiddleware.requireAuth, settingRoute);
}