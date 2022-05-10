const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  successResponseWithMsg,
  errorResponseDefault,
  successResponseDefault,
} = require("../helpers/response");
const { signUp, getPassbyUserEmail } = require("../models/auth");

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

auth.signIn = async (req, res) => {
  try {
    const {
      body: { email, pass },
    } = req;
    const data = await getPassbyUserEmail(email);
    const result = await bcrypt.compare(pass, data.pass);
    if (!result)
      return errorResponseDefault(res, 400, {
        msg: "Email or Password is invalid!",
      });
    const payload = {
      id: data.id,
      email,
    };
    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "240s",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
    successResponseDefault(res, 200, { email, token }, null);
  } catch (error) {
    const { status = 500, err } = error;
    errorResponseDefault(res, status, err);
  }
};

module.exports = auth;
