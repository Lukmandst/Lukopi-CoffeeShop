const express = require("express");
const Router = express.Router();

const productController = require("../controllers/product");
const uploadFile = require("../middlewares/upload");
const { attachedImage } = require("../middlewares/validate");

// Router products
Router.get("/all", productController.getAllProducts);
Router.get("/latest", productController.sortProductByLatest);
Router.get("/price", productController.sortProductBetweenPrice);
Router.get("/:id", productController.getProductById);
Router.get("/", productController.findProductByQuery);
Router.post("/", uploadFile, attachedImage, productController.postNewProduct);
Router.patch("/:id", uploadFile, productController.updateProductById);
Router.delete("/:id", productController.deleteProductById);

module.exports = Router;
