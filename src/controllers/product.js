const productModel = require("../models/product");
const {
  getProductsFromServer,
  // getSingleProductFromServer,
  findProduct,
  createNewProduct,
  updateProduct,
  deleteProductFromServer,
  sortProduct,
  sortByPrice
} = productModel;

const {
  successResponseDefault,
  errorResponseDefault,
  successResponseWithMsg,
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

// const getProductById = (req, res) => {
//   const id = req.params.id;
//   getSingleProductFromServer(id)
//     .then((result) => {
//       const { data } = result;
//       successResponseDefault(res, 200, data);
//     })
//     .catch((error) => {
//       const { err, status } = error;
//       errorResponseDefault(res, status, err);
//     });
// };

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
      successResponseWithMsg(res, 200, data, msg);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const updateProductById = (req, res) => {
  const id = req.params.id;
  updateProduct(id, req.body)
    .then((result) => {
      const { data, msg } = result;
      successResponseWithMsg(res, 200, data, msg);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const sortProductByLatest = (_, res) => {
  sortProduct()
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const sortProductBetweenPrice = (req, res) => {
  sortByPrice(req.query)
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

module.exports = {
  getAllProducts,
  // getProductById,
  findProductByQuery,
  postNewProduct,
  updateProductById,
  deleteProductById,
  sortProductByLatest,
  sortProductBetweenPrice
};
