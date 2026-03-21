// [GET] /

module.exports.index = (req, res) => {
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    message: "Đây là trang chủ của website"
  })
};