const { errorResponseDefault } = require("../helpers/response");
const { getUserByEmail } = require("../models/auth");

const checkDuplicate = (req, res, next) => {
  getUserByEmail(req.body.email)
    .then((result) => {
      if (result.rowCount > 0)
        return errorResponseDefault(res, 400, { msg: "Email is already registered" });
      next();
    })
    .catch((error) => {
      const { status, err } = error;
      errorResponseDefault(res, status, err);
    });
};

module.exports = {checkDuplicate};
