const productModel = require("../models/product");
const {
  getProductsFromServer,
  // getSingleProductFromServer,
  findProduct,
  createNewProduct,
  updateProduct,
  deleteProductFromServer,
  sortProduct,
  sortByPrice,
} = productModel;

const {
  successResponseDefault,
  errorResponseDefault,
  successResponseWithMsg,
  successResponsewihMeta,
} = require("../helpers/response");

const getAllProducts = (req, res) => {
  getProductsFromServer(req.query, req.route)
    .then((result) => {
      const { totalData, totalPage, data, nextPage, previousPage } = result;
      const meta = {
        totalData,
        totalPage,
        // route: `/product${req.route.path}?`,
        // query: req.query,
        page: parseInt(req.query.page),
        nextPage,
        previousPage,
      };
      successResponsewihMeta(res, 200, data, meta);
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
  findProduct(req.query, req.route)
    .then((result) => {
      const { totalData, totalPage, data, nextPage, previousPage } = result;
      const meta = {
        totalData,
        totalPage,
        // route: `/product${req.route.path}?`,
        // query: req.query,
        page: parseInt(req.query.page),
        nextPage,
        previousPage,
      };
      successResponsewihMeta(res, 200, data, meta);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const postNewProduct = (req, res) => {
  const { file = null } = req;
  createNewProduct(req.body, file)
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
  const { file = null } = req;
  updateProduct(id, req.body, file)
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
  sortProductBetweenPrice,
};
