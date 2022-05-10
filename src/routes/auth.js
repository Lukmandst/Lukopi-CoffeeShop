const Router = require("express").Router();
const authController = require("../controllers/auth");

// sign up
Router.post("/signup", authController.signUp);
// sign in
Router.post("/", () => {});
// sign out

module.exports = Router;
