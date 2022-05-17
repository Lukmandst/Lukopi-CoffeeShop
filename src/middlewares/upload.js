const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${file.fieldname}-${suffix}${[
      path.extname(file.originalname),
    ]}`;
    cb(null, filename);
  },
});

const limit = {
  fileSize: 4e6, // 4mb
};

const imageFilter = (req, file, cb) => {
  const extName = path.extname(file.originalname);
  const allowedExt = /jpg|jpeg|png/;
  if (!allowedExt.test(extName))
    return cb(new Error("Image should be .jpg, .jpeg, or .png"), false);
  cb(null, true);
};

const imageUpload = multer({
  storage: imageStorage,
  limits: limit,
  fileFilter: imageFilter,
});

module.exports = imageUpload;
