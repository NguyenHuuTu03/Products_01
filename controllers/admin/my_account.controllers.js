const Role = require("../../models/roles.model");
const Account = require("../../models/account.model");
const md5 = require("md5");

module.exports.index = async (req, res) => {
  const role = await Role.findOne({
    _id: res.locals.user.role_id
  });
  res.locals.user.role = role;
  res.render("admin/pages/my_account/index.pug", {
    pageTitle: "Thông tin tài khoản"
  });
}
module.exports.edit = (req, res) => {

  res.render("admin/pages/my_account/edit.pug", {
    pageTitle: "Cập nhật thông tin tài khoản"
  });
}
module.exports.editPatch = async (req, res) => {
  const emailExits = await Account.findOne({
    _id: {
      $ne: res.locals.user.id
    },
    deleted: false,
    email: res.locals.user.email
  });
  if (emailExits) {
    req.flash("error", `Email ${res.locals.user.email} đã tồn tại!`);
  } else {
    if (!req.body.password) {
      delete req.body.password;
    } else {
      req.body.password = md5(req.body.password);
    }
    try {
      await Account.updateOne({
        _id: res.locals.user.id
      }, req.body);
      req.flash("success", "Cập nhật thành công!");
    } catch (error) {
      req.flash("error", "Cập nhật thất bại!");
    }

  }
  res.redirect(req.get("Referer"));
}