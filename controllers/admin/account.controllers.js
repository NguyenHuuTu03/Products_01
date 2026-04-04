const md5 = require('md5');
const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record.role = role;
  }


  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Quản lý tài khoản",
    records: records
  });
}
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false
  }
  const roles = await Role.find(find);
  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Tạo tài khoản",
    roles: roles
  });
}
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false
    });
    if (emailExist) {
      req.flash("error", "Email đã tồn tại!");
      res.redirect(req.get("Referer"));
    } else {
      req.body.password = md5(req.body.password);
      const account = new Account(req.body);
      await account.save();
      req.flash("success", "Tạo mới tài khoản thành công!");
      res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

  } catch (error) {
    req.flash("error", "Tạo mới tài khoản thất bại!");
    res.redirect(req.get("Referer"));
  }
}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const account = await Account.findOne({
    deleted: false,
    _id: req.params.id
  });
  const roles = await Role.find({
    deleted: false
  });
  res.render("admin/pages/accounts/edit.pug", {
    pageTitle: "Cập nhật tài khoản",
    data: account,
    roles: roles
  });
}
// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const emailExist = await Account.findOne({
      _id: {
        $ne: req.params.id
      },
      email: req.body.email,
      deleted: false
    });

    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại!`);
      return res.redirect(req.get("referer"));
    }

    // xử lý password
    if (!req.body.password) {
      delete req.body.password;
    } else {
      req.body.password = md5(req.body.password);
    }
    await Account.updateOne({
        _id: req.params.id
      },
      req.body
    );

    req.flash("success", "Cập nhật thành công!");
    return res.redirect(req.get("referer"));

  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
    return res.redirect(req.get("referer"));
  }
};