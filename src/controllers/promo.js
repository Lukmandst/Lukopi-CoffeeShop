const promoModel = require("../models/promo");
const {
  getPromoFromServer,
  getSinglePromoFromServer,
  findPromo,
  createNewPromo,
  deletePromoFromServer,
} = promoModel;

const getAllPromos = (_, res) => {
  getPromoFromServer()
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

const getPromoById = (req, res) => {
  const id = req.params.id;
  getSinglePromoFromServer(id)
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

const findPromoByQuery = (req, res) => {
  findPromo(req.query)
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

const postNewPromo = (req, res) => {
  createNewPromo(req.body)
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

const deletePromoById = (req, res) => {
  const id = req.params.id;
  deletePromoFromServer(id)
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
  getAllPromos,
  getPromoById,
  findPromoByQuery,
  postNewPromo,
  deletePromoById,
};
