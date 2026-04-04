const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  };
  const roles = await Role.find(find);
  res.render("admin/pages/roles/index.pug", {
    pageTitle: "Nhóm quyền",
    roles: roles
  });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false
  };
  const roles = await Role.find(find);
  res.render("admin/pages/roles/create.pug", {
    pageTitle: "Tạo mới nhóm quyền"
  });
}
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  try {
    const record = new Role(req.body);
    await record.save();
    req.flash("success", "Tạo mới thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Tạo mới thất bại!");
  }
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const find = {
    deleted: false,
    _id: id
  };
  const role = await Role.findOne(find);
  res.render("admin/pages/roles/edit.pug", {
    pageTitle: "Cập nhật nhóm quyền",
    role: role
  });
}

// [GET] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({
      _id: id
    }, req.body);
    req.flash("success", "Cập nhật thành công!");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

}

// [GET] /admin/roles/permission
module.exports.permission = async (req, res) => {
  const find = {
    deleted: false
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permission.pug", {
    pageTitle: "Phân quyền",
    records: records
  });
}
// [PATCH] /admin/roles/permission
module.exports.permissionPatch = async (req, res) => {
  try {
    const permission = JSON.parse(req.body.permission);
    for (const item of permission) {
      await Role.updateOne({
        _id: item.id
      }, {
        permission: item.permission
      });
    }
    req.flash("success", "Cập nhật thành công!");

  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");

  }
  res.redirect(req.get("Referer"));
}