const express = require("express");
const Router = express.Router();

const userController = require("../controllers/user");

// Router User
Router.get("/all", userController.getAllUsers);
// Router.get("/:id", userController.getUserById);
Router.get("/", userController.findUserByQuery);
Router.post("/", userController.postNewUser);
Router.put("/:id", userController.updateUserById);
// Router.delete("/:id", userController.deleteUserById);

module.exports = Router;
