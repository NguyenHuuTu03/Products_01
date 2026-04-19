const uploadCloudinaryHelper = require('../../helpers/uploadCloudinary');

module.exports.upload = (req, res, next) => {
  if (req.file) {
    const link = uploadCloudinaryHelper(req.file.buffer);
    req.body[req.file.fieldname] = link;
  }
  next();
}