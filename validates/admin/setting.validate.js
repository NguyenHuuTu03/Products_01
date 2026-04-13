module.exports.generalPatch = (req, res, next) => {
  if (!req.body.websiteName) {
    req.flash("error", "Vui lòng nhập tên website!");
    res.redirect(req.get("Referrer"));
    return;
  }
  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect(req.get("Referrer"));
    return;
  }
  next();
}