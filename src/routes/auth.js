const Router = require("express").Router();
const authController = require("../controllers/auth");
const { checkDuplicate } = require("../middlewares/auth");

// sign up
Router.post("/signup", checkDuplicate, authController.signUp);
// sign in
Router.post("/", authController.signIn);
// sign out

module.exports = Router;
