const express = require("express");
const Router = express.Router();

const promoController = require("../controllers/promo");

Router.get("/all", promoController.getAllPromos);
Router.get("/:id", promoController.getPromoById);
Router.get("/", promoController.findPromoByQuery);
Router.post("/", promoController.postNewPromo);
Router.put("/:id", promoController.updatePromoById);
Router.delete("/:id", promoController.deletePromoById);
module.exports = Router;
