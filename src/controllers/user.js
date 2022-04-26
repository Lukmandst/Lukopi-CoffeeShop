const userModel = require("../models/user");
const {
  getUsersFromServer,
  findUser,
  getSingleUserFromServer,
  createNewUser,
  // updateUser,
  deleteUserFromServer,
} = userModel;

const {
  successResponseDefault,
  errorResponseDefault,
  successResponseforDelete,
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

const getUserById = (req, res) => {
  const id = req.params.id;
  getSingleUserFromServer(id)
    .then((result) => {
      const { data } = result;
      successResponseDefault(res, 200, data);
    })
    .catch((error) => {
      const { err, status } = error;
      errorResponseDefault(res, status, err);
    });
};

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

// const updateDataUser = (req, res) => {
//   updateUser(req.body)
//     .then(({ data }) => {
//       res.status(200).json({
//         err: null,
//         data,
//       });
//     })
//     .catch(({ status, err }) => {
//       res.status(status).json({
//         err,
//         data: [],
//       });
//     });
// };

const deleteUserById = (req, res) => {
  const id = req.params.id;
  deleteUserFromServer(id)
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
  getAllUsers,
  getUserById,
  findUserByQuery,
  postNewUser,
  // updateDataUser,
  deleteUserById,
};
