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
    const sqlQuery = "select * from transactions where transaction_id = $1";
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
      date, //1
      buyer_name, //2
      type, //3
      quantity, //4
      product_name, //5
      product_size, //6
      payment_method, //7
      total_payment_above, //8
      total_payment_less, //9
      quantity_above,// 10
      quantity_less, //11
    } = query;
    let sqlQuery =
      "select * from transactions where transaction_date = $1 or lower(user_display_name) like lower('%' || $2 || '%')  or transaction_type = $3 or product_quantity = $4 or lower(product_name) like lower('%' || $5 || '%') or product_size = $6 or payment_method = $7 or total_payment > $8 or total_payment < $9 or product_quantity > $10 or product_quantity < $11";
    // if (order) {
    //   sqlQuery += " order by " + sort + " " + order;
    // }
    db.query(sqlQuery, [
      date,
      buyer_name,
      type,
      quantity,
      product_name,
      product_size,
      payment_method,
      total_payment_above,
      total_payment_less,
      quantity_above,
      quantity_less,
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
      type,
      product_id,
      quantity,
      payment_method,
      total_payment,
      product_name,
      product_size,
    } = body;
    const sqlQuery =
      "INSERT INTO transactions (transaction_date, user_display_name, transaction_type, product_id, product_quantity, payment_method, total_payment, product_name, product_size) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    db.query(sqlQuery, [
      date,
      buyer_name,
      type,
      product_id,
      quantity,
      payment_method,
      total_payment,
      product_name,
      product_size,
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

const deleteTransactionFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "DELETE FROM transactions where transaction_id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Transactions with id= ${id} was succesfully deleted`,
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
  deleteTransactionFromServer,
};
