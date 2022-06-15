// const db = require("../config/database");
const { body, validationResult } = require("express-validator");
// const { getUserByEmail } = require("../models/auth");
// const { errorResponseDefault } = require("../helpers/response");
const validate = {};
const register = [
  body("email")
    .isEmail()
    .withMessage("Email format must be youremail@email")
    // .custom((value) => {
    //   return new Promise((resolve, reject) => {
    //     const sqlQuery =
    //       "SELECT display_name, email FROM users WHERE email = $1";
    //     db.query(sqlQuery, [value]).then((result) => {
    //       if (result.rowCount > 0) reject("Email is already registered");
    //     });
    //   });
    // })
    .normalizeEmail(),
  body("pass")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number"),
  // body("passConfirmation", "Password does not match").custom(
  //   (value, { req }) => value === req.body.pass
  // ),
];

validate.formSignUp = [
  register,
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    next();
  },
];
validate.attachedImage = (req, res, next) => {
  if (!req.file)
    return res
      .status(422)
      .json({ msg: "Add a picture to create the product!" });
  next();
};

// // validate.queryFinde
// validate.queryFind = (req, res, next) => {
//   // cek apakah query sesuai dengan yang diinginkan
//   const { query } = req;
//   const validQuery = Object.keys(query).filter(
//     (key) => key === "title" || key === "sort" || key === "order"
//   );
//   // diinginkan ada ketiga query diatas
//   if (validQuery.length < 3) {
//     return res.status(400).json({
//       err: "Query harus berisikan title, sort dan order",
//     });
//   }
//   next();
// };

// validate.productData = (req, res, next) => {
//     // cek apakah body sesuai dengan yang diinginkan
//     const { body } = req;
//     const validBody = Object.keys(body).filter(
//       (key) => key === "title" || key === "author" || key === "genre"
//     );
//     // diinginkan ada ketiga body diatas
//     if (validBody.length < 3) {
//       return res.status(400).json({
//         err: "Body harus berisikan title, author dan genre",
//       });
//     }
//     next();
//   };

module.exports = validate;
