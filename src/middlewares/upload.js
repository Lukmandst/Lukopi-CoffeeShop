const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { errorResponseDefault } = require("../helpers/response");

// const imageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/images");
//   },
//   filename: (req, file, cb) => {
//     const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
//     const filename = `${file.fieldname}-${suffix}${[
//       path.extname(file.originalname),
//     ]}`;
//     cb(null, filename);
//   },
// });

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Lukopi",
  },
});

const limit = {
  fileSize: 10e6, // 1.25mb
};

const imageFilter = (req, file, cb) => {
  try {
    const extName = path.extname(file.originalname);
    const allowedExt = /jpg|jpeg|png/;
    if (!allowedExt.test(extName))
      return cb(new Error("Image should be .jpg, .jpeg, or .png"), false);
    cb(null, true);
  } catch (error) {
    const { message } = error;
    return cb(new Error(message), false);
  }
};

// const imageUpload = multer({
//   storage: imageStorage,
//   limits: limit,
//   fileFilter: imageFilter,
// });
const imageUpload = multer({
  storage: cloudStorage,
  limits: limit,
  fileFilter: imageFilter,
}).single("photo");
const uploadFile = (req, res, next) => {
  imageUpload(req, res, (err) => {
    if (err) {
      // let status = 400;
      // if (err.message.includes("Not Found")) status = 404;
      // next({ status, message: err.message });
      // return;
      return errorResponseDefault(res, 404, { msg: err.message });
    }
    next();
  });
};

module.exports = uploadFile;
