// const { body } = require("express-validator");


// const userValidation = [
//   body("email", "Please include a valid email").isEmail(),
//   body("password", "Password must be 6 or more characters").isLength({
//     min: 6,
//   }),
// ];

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

// module.exports = {
//     userValidation
// };
