const transactionModel = require("../models/transaction");

const {
  getTransactionsFromServer,
  getSingleTransactionFromServer,
  findTransaction,
  createNewTransaction,
  deleteTransactionFromServer,
} = transactionModel;

const {
  successResponseDefault,
  errorResponseDefault,
  successResponseforDelete,
} = require("../helpers/response");

const getAllTransactions = (_, res) => {
  getTransactionsFromServer()
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const getTransactionById = (req, res) => {
  const id = req.params.id;
  getSingleTransactionFromServer(id)
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const findTransactionByQuery = (req, res) => {
  findTransaction(req.query)
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const postNewTransaction = (req, res) => {
  createNewTransaction(req.body)
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const deleteTransactionById = (req, res) => {
  const id = req.params.id;
  deleteTransactionFromServer(id)
    .then((result) => {
      const { data, msg } = result;
      successResponseforDelete(res, 200, data, msg);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  findTransactionByQuery,
  postNewTransaction,
  deleteTransactionById,
};
