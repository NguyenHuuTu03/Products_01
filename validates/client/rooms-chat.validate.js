module.exports.createPost = (req, res, next) => {
  if (!req.body.nameRoomChat) {
    req.flash("error", "Vui lòng nhập tên phòng chat!");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
}