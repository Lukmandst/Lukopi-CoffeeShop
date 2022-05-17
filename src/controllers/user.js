const userModel = require("../models/user");
const {
  getUsersFromServer,
  findUser,
  // getSingleUserFromServer,
  createNewUser,
  updateUser,
  updateImageUser,
  // deleteUserFromServer,
} = userModel;

const {
  successResponseDefault,
  errorResponseDefault,
  successResponseWithMsg,
  successResponsewihMeta,
} = require("../helpers/response");

const getAllUsers = (req, res) => {
  getUsersFromServer(req.query, req.route)
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

// const getUserById = (req, res) => {
//   const id = req.params.id;
//   getSingleUserFromServer(id)
//     .then((result) => {
//       const { data } = result;
//       successResponseDefault(res, 200, data);
//     })
//     .catch((error) => {
//       const { err, status } = error;
//       errorResponseDefault(res, status, err);
//     });
// };

const findUserByQuery = (req, res) => {
  findUser(req.query, req.route)
    .then((result) => {
      const { total,totalData, totalPage, data, nextPage, previousPage } = result;
      const meta = {
        totalData,
        totalPage,
        // route: `/product${req.route.path}?`,
        // query: req.query,
        page: parseInt(req.query.page),
        nextPage,
        previousPage,
      };
      successResponsewihMeta(res, 200, {total,data}, meta);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const postNewUser = (req, res) => {
  createNewUser(req.body)
    .then((result) => {
      const { data } = result;
      successResponseDefault(res, 200, data);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

const updateUserById = (req, res) => {
  const { file = null } = req;
  updateUser(req.userPayload.id, req.body, file)
    .then((result) => {
      const { data, msg } = result;
      successResponseWithMsg(res, 200, data, msg);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

// const deleteUserById = (req, res) => {
//   const id = req.params.id;
//   deleteUserFromServer(id)
//     .then((result) => {
//       const { data, msg } = result;
//       successResponseWithMsg(res, 200, data, msg);
//     })
//     .catch((error) => {
//       const { err, status } = error;
//       errorResponseDefault(res, status, err);
//     });
// };
const updatePhotoUser = (req, res) => {
  const { file = null } = req;
  updateImageUser(req.userPayload.id, file)
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
  getAllUsers,
  // getUserById,
  findUserByQuery,
  postNewUser,
  updateUserById,
  // deleteUserById,
  updatePhotoUser,
};
