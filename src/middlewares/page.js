// const db = require("../config/database");
// const pageFormat = {};

// pageFormat.pagingDefault = (response, page, offset, limit, route) => {
//   return new Promise((resolve, reject) => {
//     db.query("SELECT COUNT(*) AS total_product FROM products")
//       .then((result) => {
//         response.totalData = parseInt(result.rows[0]["total_product"]);
//         response.totalPage = Math.ceil(response.totalData / parseInt(limit));
//         if (page < response.totalPage)
//           response.nextPage = `${route.path}?page=${parseInt(page) + 1}`;
//         if (offset > 0)
//           response.previousPage = `${route.path}?page=${parseInt(page) - 1}`;
//         resolve(response);
//       })
//       .catch((err) => {
//         reject({ status: 500, err });
//       });
//   });
// };
// module.exports = pageFormat;
