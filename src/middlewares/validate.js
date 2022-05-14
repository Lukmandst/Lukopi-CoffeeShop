const { body, validationResult } = require("express-validator");
const validate = {};
const register = [
  body("email", "Your email is not valid")
    .not()
    .isEmpty()
    .isEmail()
    .normalizeEmail(),
  body("pass", "Password must be at least 5 characters")
    .not()
    .isEmpty()
    .isLength({ min: 5 }),
  body("passConfirmation", "Password does not match").custom(
    (value, { req }) => value === req.body.pass
  ),
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
