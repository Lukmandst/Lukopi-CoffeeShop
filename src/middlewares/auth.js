const jwt = require("jsonwebtoken");
const { errorResponseDefault } = require("../helpers/response");
const { getUserByEmail } = require("../models/auth");
const { client } = require("../config/redis");

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
    async (err, payload) => {
      if (err && err.name === "TokenExpiredError")
        return errorResponseDefault(res, 401, {
          msg: "Time Out!, please Sign In again",
        });
      try {
        const cachedToken = await client.get(`login-${payload.id}`);
        if (!cachedToken) {
          return errorResponseDefault(res, 401, {
            msg: "Please Sign In first!",
          });
        }

        if (cachedToken !== token) {
          return errorResponseDefault(res, 401, {
            msg: "Unauthorized, please Sign In again",
          });
        }
        req.userPayload = payload;
        // console.log(payload);
        next();
      } catch (error) {
        const status = error.status ? error.status : 500;
        return errorResponseDefault(res, status, { msg: error.message });
      }
    }
  );
};
const checkResetCode1 = async (req, res) => {
  try {
    const { email } = req.params;
    // console.log(email);
    const { confirmCode } = req.body;
    const confirm = await client.get(`forgotpass-${email}`);
    console.log(confirm);
    if (confirm !== confirmCode) {
      res.status(403).json({ error: "Invalid Confirmation Code !" });
      return;
    }
    res.status(200).json({ msg: "Code Verified" });
  } catch (error) {
    const status = error.status ? error.status : 500;
    return errorResponseDefault(res, status, { msg: error.message });
  }
};
const checkResetCode2 = async (req, res, next) => {
  try {
    const { email } = req.params;
    // console.log(email);
    const { confirmCode } = req.body;
    const confirm = await client.get(`forgotpass-${email}`);
    console.log(confirm);
    if (confirm !== confirmCode) {
      res.status(403).json({ error: "Invalid Confirmation Code !" });
      return;
    }
    next();
  } catch (error) {
    const status = error.status ? error.status : 500;
    return errorResponseDefault(res, status, { msg: error.message });
  }
};
const checkActivateToken = async (req, _res, next) => {
  const { token } = req.params;
  jwt.verify(
    token,
    process.env.JWT_SECRET,
    process.env.JWT_ISSUER,
    async (err, payload) => {
      if (err && err.name === "TokenExpiredError") {
        return errorResponseDefault(_res, 401, {
          msg: "The link has expired. Please make a new request.",
        });
      }
      if (err) {
        return errorResponseDefault(_res, 401, { msg: "Access denied" });
      }

      try {
        const cachedToken = await client.get(`register-${payload.email}`);
        console.log(cachedToken);
        if (!cachedToken) {
          return errorResponseDefault(_res, 403, {
            msg: "Your link expired,please register again",
          });
        }

        if (cachedToken !== token) {
          return errorResponseDefault(_res, 403, {
            msg: "Unauthorized token, please register again",
          });
        }
      } catch (error) {
        console.log(error);
        const { status = 500, err } = error;
        errorResponseDefault(_res, status, err);
      }
      req.userPayload = payload;
      next();
    }
  );
};
module.exports = {
  checkDuplicate,
  checkToken,
  checkResetCode1,
  checkResetCode2,
  checkActivateToken,
};
