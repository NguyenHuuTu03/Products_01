const User = require("../../models/user.model");
const md5 = require("md5");

//[GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký"
  });
}

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  const exitUser = await User.findOne({
    email: req.body.email
  });
  if (exitUser) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/")
}

//[GET] /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập"
  });
}

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (md5(password) !== user.password) {
    req.flash("error", "Password không đúng!");
    res.redirect(req.get("Referer"));
    return;
  }
  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đã bị khoá!");
    res.redirect(req.get("Referer"));
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
}