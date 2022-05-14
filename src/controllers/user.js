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
} = require("../helpers/response");

const getAllUsers = (_, res) => {
  getUsersFromServer()
    .then((result) => {
      const { data, total } = result;
      successResponseDefault(res, 200, data, total);
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
  findUser(req.query)
    .then((result) => {
      const { data } = result;
      successResponseDefault(res, 200, data);
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
  updateUser(req.userPayload.id, req.body)
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
