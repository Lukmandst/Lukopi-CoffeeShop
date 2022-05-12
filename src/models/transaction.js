const db = require("../config/database");

const getTransactionsFromServer = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM transactions")
      .then((result) => {
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getSingleTransactionFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "select * from transactions where id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject({ status: 404, err: "Transaction Not Found" });
        }
        const response = {
          data: data.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const findTransaction = (query) => {
  return new Promise((resolve, reject) => {
    const {
      date,
      buyer_name,
      quantity,
      product_id,
      product_size,
      quantity_above,
      quantity_less,
      user_id,
    } = query;
    let sqlQuery =
      "select * from transactions where date = $1 or lower(users_display_name) like lower('%' || $2 || '%') or quantity = $3 or products_id = $4 or sizes_id = $5 or quantity > $6 or quantity < $7 or users_id = $8";
    // if (order) {
    //   sqlQuery += " order by " + sort + " " + order;
    // }
    db.query(sqlQuery, [
      date,
      buyer_name,
      quantity,
      product_id,
      product_size,
      quantity_above,
      quantity_less,
      user_id,
    ])
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "Transaction Not Found" });
        }
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const createNewTransaction = (body) => {
  return new Promise((resolve, reject) => {
    const {
      date,
      buyer_name,
      quantity,
      product_id,
      product_size,
      quantity_above,
      quantity_less,
      user_id,
    } = body;
    const sqlQuery =
      "INSERT INTO transactions (date, users_display_name, products_id, quantity, sizes_id, users_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    db.query(sqlQuery, [
      date,
      buyer_name,
      quantity,
      product_id,
      product_size,
      quantity_above,
      quantity_less,
      user_id,
    ])
      .then(({ rows }) => {
        const response = {
          data: rows[0],
        };
        resolve(response);
      })
      .catch((err) => reject({ status: 500, err }));
  });
};

// const deleteTransactionFromServer = (id) => {
//   return new Promise((resolve, reject) => {
//     const sqlQuery = "DELETE FROM transactions where id = $1";
//     db.query(sqlQuery, [id])
//       .then((data) => {
//         const response = {
//           data: data.rows,
//           msg: `Transactions with id= ${id} was successfully deleted`,
//         };
//         resolve(response);
//       })
//       .catch((err) => {
//         reject({ status: 500, err });
//       });
//   });
// };

const sortProduct = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT products_id, COUNT (products_id) FROM transactions GROUP BY products_id"
    )
      .then((result) => {
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

module.exports = {
  getTransactionsFromServer,
  getSingleTransactionFromServer,
  findTransaction,
  createNewTransaction,
  // deleteTransactionFromServer,
  sortProduct,
};
