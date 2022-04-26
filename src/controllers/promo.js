const promoModel = require("../models/promo");
const {
  getPromoFromServer,
  getSinglePromoFromServer,
  findPromo,
  createNewPromo,
  deletePromoFromServer,
} = promoModel;

const {
  successResponseDefault,
  errorResponseDefault,
  successResponseforDelete,
} = require("../helpers/response");

const getAllPromos = (_, res) => {
  getPromoFromServer()
  .then((result) => {
    const { data, total } = result;
    successResponseDefault(res, 200, data, total);
  })
  .catch((error) => {
    const { err, status } = error;
    errorResponseDefault(res, status, err);
  });
};

const getPromoById = (req, res) => {
  const id = req.params.id;
  getSinglePromoFromServer(id)
  .then((result) => {
    const { data } = result;
    successResponseDefault(res, 200, data);
  })
  .catch((error) => {
    const { err, status } = error;
    errorResponseDefault(res, status, err);
  });
};

const findPromoByQuery = (req, res) => {
  findPromo(req.query)
  .then((result) => {
    const { data, total } = result;
    successResponseDefault(res, 200, data, total);
  })
  .catch((error) => {
    const { err, status } = error;
    errorResponseDefault(res, status, err);
  });
};

const postNewPromo = (req, res) => {
  createNewPromo(req.body)
  .then((result) => {
    const { data } = result;
    successResponseDefault(res, 200, data);
  })
  .catch((error) => {
    const { err, status } = error;
    errorResponseDefault(res, status, err);
  });
};

const deletePromoById = (req, res) => {
  const id = req.params.id;
  deletePromoFromServer(id)
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
  getAllPromos,
  getPromoById,
  findPromoByQuery,
  postNewPromo,
  deletePromoById,
};
