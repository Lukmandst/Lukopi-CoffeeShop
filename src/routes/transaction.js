const express = require("express");
const Router = express.Router();

const transactionController = require("../controllers/transaction");

Router.get("/all", transactionController.getAllTransactions);
Router.get("/favorite", transactionController.sortPopularProduct);
Router.get("/:id", transactionController.getTransactionById);
Router.get("/", transactionController.findTransactionByQuery);
Router.post("/", transactionController.postNewTransaction);
Router.delete("/", transactionController.deleteTransactionById);

module.exports=Router;