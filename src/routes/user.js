const express = require("express");
const Router = express.Router();

const userController = require("../controllers/user");
const { checkToken } = require("../middlewares/auth");

// Router User
Router.get("/all", userController.getAllUsers);
// Router.get("/:id", userController.getUserById);
Router.get("/", userController.findUserByQuery);
Router.post("/", userController.postNewUser);
Router.put("/edit", checkToken, userController.updateUserById);
// Router.delete("/:id", userController.deleteUserById);

module.exports = Router;
