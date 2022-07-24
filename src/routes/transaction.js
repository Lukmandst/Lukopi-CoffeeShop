const express = require("express");
const Router = express.Router();

const transactionController = require("../controllers/transaction");
const { checkToken } = require("../middlewares/auth");

Router.get("/all", transactionController.getAllTransactions);
Router.get("/favorite", transactionController.sortPopularProduct);
Router.get("/history", checkToken, transactionController.getUserTransactions);
Router.get("/", transactionController.findTransactionByQuery);
Router.post("/", checkToken, transactionController.postNewTransaction);
Router.delete("/multiple", transactionController.deleteTransactionByMultipleId);
Router.delete("/:id", transactionController.deleteTransactionById);
Router.delete("/", checkToken, transactionController.deleteUserTransactions);
module.exports = Router;
