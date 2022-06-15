const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  successResponseWithMsg,
  errorResponseDefault,
  successResponseDefault,
} = require("../helpers/response");
const { signUp, getInfobyUserEmail } = require("../models/auth");

const auth = {};

auth.signUp = (req, res) => {
  const {
    body: { email, pass, phone },
  } = req;
  bcrypt
    .hash(pass, 9)
    .then((hashedPass) => {
      signUp(email, hashedPass, phone)
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
    const data = await getInfobyUserEmail(email);
    const name = data.display_name;
    const role = data.role;
    const result = await bcrypt.compare(pass, data.pass);
    if (!result)
      return errorResponseDefault(res, 400, {
        msg: "Email or Password is invalid!",
      });
    const payload = {
      id: data.id,
      name,
      email,
      role,
    };
    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "1d",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
    successResponseDefault(res, 200, { name, email, role, token }, null);
  } catch (error) {
    const { status = 500, err } = error;
    errorResponseDefault(res, status, err);
  }
};

module.exports = auth;
