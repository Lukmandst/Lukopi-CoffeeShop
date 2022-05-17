const express = require("express");
const Router = express.Router();

const userController = require("../controllers/user");
const { checkToken } = require("../middlewares/auth");
const imageUpload = require("../middlewares/upload");

// Router User
Router.get("/all", userController.getAllUsers);
// Router.get("/:id", userController.getUserById);
Router.get("/", userController.findUserByQuery);
Router.post("/", userController.postNewUser);
Router.patch("/edit", checkToken, imageUpload.single("photo"),userController.updateUserById);
Router.patch("/", checkToken, imageUpload.single("picture"), userController.updatePhotoUser);
// Router.delete("/:id", userController.deleteUserById);

module.exports = Router;
