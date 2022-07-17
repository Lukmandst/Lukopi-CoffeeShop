const Router = require("express").Router();
const {
  signUp,
  signIn,
  logout,
  confirmEmail,
  resetPassword,
  forgotPassword,
} = require("../controllers/auth");
const {
  checkDuplicate,
  checkResetCode1,
  checkResetCode2,
  checkActivateToken,
  checkToken,
} = require("../middlewares/auth");
const { formSignUp } = require("../middlewares/validate");

// confirm email
Router.get("/confirm/:token", checkActivateToken, confirmEmail);
// sign up
Router.post("/signup", formSignUp, checkDuplicate, signUp);
// forgot password
Router.post("/forgot", forgotPassword);
// confirm forgot password
Router.post("/confirm-pass/:email", checkResetCode1);
// reset password
Router.post("/reset/:email", checkResetCode2, resetPassword);
// sign in
Router.post("/", signIn);
// sign out
Router.delete("/", checkToken, logout);

module.exports = Router;
