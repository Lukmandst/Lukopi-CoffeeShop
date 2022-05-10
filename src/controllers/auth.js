const bcrypt = require("bcrypt");
const {
  successResponseWithMsg,
  errorResponseDefault,
} = require("../helpers/response");
const { signUp } = require("../models/auth");

const auth = {};

auth.signUp = (req, res) => {
  const {
    body: { email, pass },
  } = req;
  bcrypt
    .hash(pass, 9)
    .then((hashedPass) => {
      signUp(email, hashedPass)
        .then((result) => {
          const { data, msg } = result;
          successResponseWithMsg(res, 201, data, msg);
        })
        .catch((error) => {
          const { status, err } = error;
          errorResponseDefault(res, status, err);
        });
    })
    .catch((err) => {
      errorResponseDefault(res, 500, err);
    });
};

// auth.signIn = (req, res) => {};

module.exports = auth;
