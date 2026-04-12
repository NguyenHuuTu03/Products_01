const User = require("../../models/user.model");

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
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/")
}