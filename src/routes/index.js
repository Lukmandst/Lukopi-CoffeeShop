const express = require("express");

const Router = express.Router();

const productRouter = require("./product");
const userRouter = require("./user");
const transactionRouter = require("./transaction");
const promoRouter = require("./promo");
const authRouter = require("./auth");

Router.use("/product", productRouter);
Router.use("/user", userRouter);
Router.use("/transaction", transactionRouter);
Router.use("/promo", promoRouter);
Router.use("/auth", authRouter);

module.exports = Router;
