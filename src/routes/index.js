const express = require("express");

const Router = express.Router();

const productRouter = require("./product");
const userRouter = require("./user");
const transactionRouter = require("./transaction");
const promoRouter = require("./promo");
const authRouter = require("./auth");
Router.get("/", (_req, res) => {
  res.json({
    message: "This is Lukopi API",
  });
});
Router.use("/product", productRouter);
Router.use("/user", userRouter);
Router.use("/transaction", transactionRouter);
Router.use("/promo", promoRouter);
Router.use("/auth", authRouter);
Router.get("*", (_req, res) => {
  res.status(404).json({
    message: "Api Not Found",
  });
});
module.exports = Router;
