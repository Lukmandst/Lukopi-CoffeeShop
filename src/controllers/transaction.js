const transactionModel = require("../models/transaction");

const {
  getTransactionsFromServer,
  getSingleTransactionFromServer,
  findTransaction,
  createNewTransaction,
  deleteTransactionFromServer,
} = transactionModel;

const getAllTransactions = (_, res) => {
  getTransactionsFromServer()
    .then(({ data }) => {
      res.status(200).json({
        data,
        err: null,
      });
    })
    .catch((error) => {
      const { err, status } = error;
      res.status(status).json({
        data: [],
        err,
      });
    });
};

const getTransactionById = (req, res) => {
  const id = req.params.id;
  getSingleTransactionFromServer(id)
    .then(({ data }) => {
      res.status(200).json({
        data,
        err: null,
      });
    })
    .catch((error) => {
      const { err, status } = error;
      res.status(status).json({
        data: [],
        err,
      });
    });
};

const findTransactionByQuery = (req, res) => {
  findTransaction(req.query)
    .then(({ data, total }) => {
      res.status(200).json({
        err: null,
        data,
        total,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        data: [],
        err,
      });
    });
};

const postNewTransaction = (req, res) => {
  createNewTransaction(req.body)
    .then(({ data }) => {
      res.status(200).json({
        err: null,
        data,
      });
    })
    .catch(({ status, err }) => {
      res.status(status).json({
        err,
        data: [],
      });
    });
};

const deleteTransactionById = (req, res) => {
  const id = req.params.id;
  deleteTransactionFromServer(id)
    .then(({ data, msg }) => {
      res.status(200).json({
        data,
        msg,
        err: null,
      });
    })
    .catch((error) => {
      const { err, status } = error;
      res.status(status).json({
        data: [],
        err,
      });
    });
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  findTransactionByQuery,
  postNewTransaction,
  deleteTransactionById,
};
