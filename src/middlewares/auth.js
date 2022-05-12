const jwt = require("jsonwebtoken");
const { errorResponseDefault } = require("../helpers/response");
const { getUserByEmail } = require("../models/auth");

const checkDuplicate = (req, res, next) => {
  getUserByEmail(req.body.email)
    .then((result) => {
      if (result.rowCount > 0)
        return errorResponseDefault(res, 400, {
          msg: "Email is already registered",
        });
      next();
    })
    .catch((error) => {
      const { status, err } = error;
      errorResponseDefault(res, status, err);
    });
};

const checkToken = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken) {
    return errorResponseDefault(res, 401, { msg: "Please Sign In first!" });
  }
  const token = bearerToken.split(" ")[1];
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { issuer: process.env.JWT_ISSUER },
    (err, payload) => {
      if (err && err.name === "TokenExpiredError")
        return errorResponseDefault(res, 401, {
          msg: "Your session was expired, please Sign In again!",
        });
      req.userPayload = payload;
      console.log(payload);
      next();
    }
  );
};

module.exports = { checkDuplicate, checkToken };
