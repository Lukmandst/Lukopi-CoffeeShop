const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendPasswordConfirmation,
} = require("../config/nodemailer");
const { client } = require("../config/redis");
const {
  successResponseWithMsg,
  errorResponseDefault,
  successResponseDefault,
} = require("../helpers/response");
const {
  signUp,
  getInfobyUserEmail,
  verifyEmail,
  updatePasswordWithEmail,
  getUserByEmail,
} = require("../models/auth");

const auth = {};

auth.signUp = (req, res) => {
  const {
    body: { email, pass, phone },
  } = req;
  bcrypt
    .hash(pass, 9)
    .then((hashedPass) => {
      signUp(email, hashedPass, phone)
        .then(async ({ data, msg }) => {
          const token = jwt.sign({ email: data.email }, process.env.JWT_SECRET);
          await client.set(`register-${data.email}`, token);
          await sendConfirmationEmail(data.email, data.email, token);
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
    const roles_id = data.roles_id;
    const verify = await bcrypt.compare(pass, data.pass);
    if (!verify)
      return errorResponseDefault(res, 400, {
        msg: "Email or Password is invalid!",
      });
    if (data.status !== "active") {
      return errorResponseDefault(res, 403, {
        msg: "Account is not activated. Please check your email to activate your account",
      });
    }
    const payload = {
      id: data.id,
      email,
      roles_id,
    };
    const jwtOptions = {
      issuer: process.env.JWT_ISSUER,
      expiresIn: "1d",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, jwtOptions);
    await client.set(`login-${data.id}`, token, { EX: 86400 });
    successResponseDefault(res, 200, { email, roles_id, token }, null);
  } catch (error) {
    const { status = 500, err } = error;
    errorResponseDefault(res, status, err);
  }
};

auth.logout = async (req, res) => {
  try {
    const cachedLogin = await client.get(`login-${req.userPayload.id}`);
    if (cachedLogin) {
      await client.del(`login-${req.userPayload.id}`);
      successResponseWithMsg(
        res,
        200,
        { message: "You have successfully logged out" },
        null
      );

    }
  } catch (err) {
    errorResponseDefault(res, 500, err.message);
  }
};

auth.confirmEmail = async (req, res) => {
  try {
    const { email } = req.userPayload;
    const data = await verifyEmail(email);
    if (data) {
      await client.del(`register-${email}`);
      res
        .status(200)
        .json({ msg: "Your Email has been verified. Please Login" });
    }
  } catch (error) {
    console.log(error);
    const { status = 500, err } = error;
    errorResponseDefault(res, status, err.message);
  }
};

auth.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const confirmCode = Math.floor(Math.random() * 9999) + 1000;
    const userData = await getUserByEmail(email);
    await sendPasswordConfirmation(
      userData.display_name ? userData.display_name : "customer",
      email,
      confirmCode
    );
    await client.set(`forgotpass-${email}`, confirmCode);
    res.status(200).json({
      msg: "Please check your email for code confirmation",
    });
    console.log(confirmCode);
  } catch (error) {
    const { message, status } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

auth.resetPassword = async (req, res) => {
  try {
    const { email } = req.params;
    const { newPassword } = req.body;
    const hashedPass = await bcrypt.hash(newPassword, 9);
    const { msg } = await updatePasswordWithEmail(hashedPass, email);
    await client.del(`forgotpass${email}`);
    res.status(200).json(msg);
  } catch (error) {
    console.log(error);
    const { message, status } = error;
    res.status(status ? status : 500).json({
      error: message,
    });
  }
};

module.exports = auth;
