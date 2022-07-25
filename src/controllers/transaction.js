const transactionModel = require("../models/transaction");

const {
  getTransactionsFromServer,
  getSingleTransactionFromServer,
  findTransaction,
  createNewTransaction,
  deleteTransactionsFromUsers,
  sortProduct,
  deleteOneTransactionsFromUsers,
  deleteMultipleTransactionsFromUsers,
} = transactionModel;

const {
  successResponseDefault,
  errorResponseDefault,
  successResponseWithMsg,
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

const getUserTransactions = (req, res) => {
  getSingleTransactionFromServer(req.userPayload.id)
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
  createNewTransaction(req.userPayload.id, req.body)
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
  deleteOneTransactionsFromUsers(id)
    .then((result) => {
      const { data, msg } = result;
      successResponseWithMsg(res, 200, data, msg);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};
const deleteTransactionByMultipleId = (req, res) => {
  const transaction_id = req.body.id;
  deleteMultipleTransactionsFromUsers(transaction_id)
    .then((result) => {
      const { data, msg } = result;
      successResponseWithMsg(res, 200, data, msg);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const sortPopularProduct = (req, res) => {
  sortProduct(req.query)
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const deleteUserTransactions = (req, res) => {
  deleteTransactionsFromUsers(req.userPayload.id)
    .then((result) => {
      const { data, msg } = result;
      successResponseWithMsg(res, 200, data, msg);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

module.exports = {
  getAllTransactions,
  getUserTransactions,
  findTransactionByQuery,
  postNewTransaction,
  deleteTransactionById,
  sortPopularProduct,
  deleteUserTransactions,
  deleteTransactionByMultipleId,
};
