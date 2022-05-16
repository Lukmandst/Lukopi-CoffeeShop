const express = require("express");
const Router = express.Router();

const productController = require("../controllers/product");
const imageUpload = require("../middlewares/upload");
const { attachedImage } = require("../middlewares/validate");

// Router products
Router.get("/all", productController.getAllProducts);
Router.get("/latest", productController.sortProductByLatest);
Router.get("/price", productController.sortProductBetweenPrice);
// Router.get("/:id", productController.getProductById);
Router.get("/", productController.findProductByQuery);
Router.post(
  "/",
  imageUpload.single("image"),
  attachedImage,
  productController.postNewProduct
);
Router.put("/:id", productController.updateProductById);
Router.delete("/:id", productController.deleteProductById);

module.exports = Router;
