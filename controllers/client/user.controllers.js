const User = require("../../models/user.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");
const Cart = require("../../models/cart.model");

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
  const cart = await Cart.findOne({
    user_id: user.id
  });
  if (cart) {
    res.cookie("cartId", cart.id);
  } else {
    await Cart.updateOne({
      _id: req.cookies.cartId
    }, {
      user_id: user.id
    })
  }

  res.cookie("tokenUser", user.tokenUser);

  // cập nhật trạng thái online
  await User.updateOne({
    tokenUser: user.tokenUser
  }, {
    statusOnline: "online"
  });

  // cập nhật trạng thái online real-time
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
      userId: user.id,
      status: "online"
    });
  });
  res.redirect("/");
}

//[GET] /user/logout
module.exports.logout = async (req, res) => {

  // cập nhật trạng thái offline
  await User.updateOne({
    tokenUser: res.locals.user.tokenUser
  }, {
    statusOnline: "offline"
  });

  // cập nhật trạng thái offline real-time
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
      userId: res.locals.user.id,
      status: "offline"
    });
  });

  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/")
}

//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {

  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu"
  })
}

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false
  }).select("-password");
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  const otp = generateHelper.generateRandomNumber(8);
  const objectForgot = {
    email: email,
    otp: otp,
    // expireAt: Date.now()
    expireAt: new Date(Date.now() + 10 * 1000)
  }
  const forgotPassword = new ForgotPassword(objectForgot);
  await forgotPassword.save();

  const subject = "Mã OTP xác minh mật khẩu";
  const html = `Mã OTP xác minh mật khẩu là: <b>${otp}</b>. Mã có hiệu lực 3 phút.`;
  const sendMail = await sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
}

//[GET] /user/password/otp?email=${email}
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã otp",
    email: email
  });
}

//[POST] /user/password/otp?email=${email}
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });
  if (!result) {
    req.flash("error", "OTP không hợp lệ!");
    res.redirect(req.get("Referer"));
    return;
  }
  const user = await User.findOne({
    email: email
  });
  res.cookie("resetEmail", email);

  res.redirect("/user/password/reset");
}

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đặt lại mật khẩu"
  });
}

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const email = req.cookies.resetEmail;
  const user = await User.findOne({
    email: email
  });

  await User.updateOne({
    email: email
  }, {
    password: md5(password)
  });

  res.clearCookie("resetEmail");
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
}

//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Tài khoản của tôi"
  });
}

//[GET] /user/info/edit
module.exports.infoEdit = async (req, res) => {
  res.render("client/pages/user/info-edit", {
    pageTitle: "Tài khoản của tôi"
  });
}

//[POST] /user/info/edit
module.exports.infoEditPost = async (req, res) => {
  await User.updateOne({
    tokenUser: req.cookies.tokenUser
  }, req.body);
  res.redirect(req.get("Referer"));
}