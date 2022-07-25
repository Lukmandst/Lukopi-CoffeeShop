const express = require("express");
const Router = express.Router();

const userController = require("../controllers/user");
const { checkToken } = require("../middlewares/auth");
const uploadFile = require("../middlewares/upload");

// Router User
Router.get("/all", userController.getAllUsers);
Router.get("/info", checkToken, userController.getUserById);
Router.get("/", userController.findUserByQuery);
Router.post("/", userController.postNewUser);
Router.patch("/edit", checkToken, uploadFile, userController.updateUserById);
Router.patch("/editPass", checkToken, userController.updateUserPassword);
Router.patch("/", checkToken, uploadFile, userController.updatePhotoUser);
// Router.delete("/:id", userController.deleteUserById);

module.exports = Router;
