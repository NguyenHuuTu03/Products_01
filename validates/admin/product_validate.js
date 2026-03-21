module.exports.validatePost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề!");
    res.redirect(req.get("Referrer"));
    return;
  }
  next(); // để chạy tiếp vào hàm tiếp theo trong router
}