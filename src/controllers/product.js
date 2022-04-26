const productModel = require("../models/product");
const {
  getProductsFromServer,
  getSingleProductFromServer,
  findProduct,
  createNewProduct,
  deleteProductFromServer,
} = productModel;

const {
  successResponseDefault,
  errorResponseDefault,
  successResponseforDelete,
} = require("../helpers/response");

const getAllProducts = (_, res) => {
  getProductsFromServer()
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const getProductById = (req, res) => {
  const id = req.params.id;
  getSingleProductFromServer(id)
    .then((result) => {
      const { data } = result;
      successResponseDefault(res, 200, data);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const findProductByQuery = (req, res) => {
  findProduct(req.query)
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const postNewProduct = (req, res) => {
  createNewProduct(req.body)
    .then((result) => {
      const { data } = result;
      successResponseDefault(res, 200, data);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const deleteProductById = (req, res) => {
  const id = req.params.id;
  deleteProductFromServer(id)
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
  getAllProducts,
  getProductById,
  findProductByQuery,
  postNewProduct,
  deleteProductById,
};
