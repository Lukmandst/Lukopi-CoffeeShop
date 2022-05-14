const Router = require("express").Router();
const authController = require("../controllers/auth");
const { checkDuplicate } = require("../middlewares/auth");
const { formSignUp } = require("../middlewares/validate");

// sign up
Router.post("/signup", formSignUp, checkDuplicate, authController.signUp);
// sign in
Router.post("/", authController.signIn);
// sign out

module.exports = Router;
