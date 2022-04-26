const userModel = require("../models/user");
const {
  getUsersFromServer,
  findUser,
  getSingleUserFromServer,
  createNewUser,
  // updateUser,
  deleteUserFromServer,
} = userModel;

const getAllUsers = (_, res) => {
  getUsersFromServer()
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

const getUserById = (req, res) => {
  const id = req.params.id;
  getSingleUserFromServer(id)
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

const findUserByQuery = (req, res) => {
  findUser(req.query)
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

const postNewUser = (req, res) => {
  createNewUser(req.body)
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
    .then(({ data,msg }) => {
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
  getAllUsers,
  getUserById,
  findUserByQuery,
  postNewUser,
  // updateDataUser,
  deleteUserById,
};
