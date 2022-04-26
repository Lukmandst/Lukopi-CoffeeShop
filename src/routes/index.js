const express = require("express");

const Router = express.Router();

const productRouter = require("./product");
const userRouter = require("./user");
const transactionRouter = require("./transaction");
const promoRouter = require("./promo");

Router.use("/product", productRouter);
Router.use("/user", userRouter);
Router.use("/transaction", transactionRouter);
Router.use("/promo", promoRouter);

module.exports = Router;
