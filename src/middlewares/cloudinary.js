const cloudinary = require("cloudinary").v2;

const cloudinaryConfig = (req, res, next) => {
  cloudinary.config({
    cloud_name: "lukuluku",
    api_key: "379189598229778",
    api_secret: "WuyirJVQH3agTu2GMDm1oUe_7RM",
  });
  next();
};

module.exports = cloudinaryConfig;
