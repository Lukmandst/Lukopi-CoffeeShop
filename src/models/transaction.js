const db = require("../config/database");
const { v4: uuidV4 } = require("uuid");

const getTransactionsFromServer = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "select date(date), sum(t.total_price) as income from transactions t where t.date > now() -interval '1 week' group by date(date) order by date(date) asc"
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

const getSingleTransactionFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "SELECT t.id, t.products_id , t.total_price, t.delivery , t.date, t.sizes , p.name AS product_name, p.image FROM transactions t JOIN products p ON t.products_id = p.id WHERE t.users_id = $1 AND t.deleted_at ISNULL ORDER BY t.date DESC ";
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

const createNewTransaction = (user_id, body) => {
  return new Promise((resolve, reject) => {
    const { quantity, product_id, product_size, delivery, total_price } = body;
    console.log(body);
    const time = new Date(Date.now());
    const id = uuidV4();
    const values = [
      id,
      time,
      product_id,
      quantity,
      product_size,
      user_id,
      delivery,
      total_price,
    ];
    const sqlQuery =
      "INSERT INTO transactions (id, date,  products_id, quantity, sizes, users_id, delivery, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)  RETURNING *";
    db.query(sqlQuery, values)
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

const sortProduct = (query) => {
  return new Promise((resolve, reject) => {
    const { name } = query;
    const value = [];
    let sqlQuery = "";
    if (!name) {
      sqlQuery +=
        "SELECT p.id, p.name, p.price, p.image, COUNT(*) FROM transactions t JOIN products p on t.products_id = p.id GROUP BY p.id, p.name, p.price, p.image ORDER BY COUNT(*) DESC LIMIT 10";
    }
    if (name) {
      sqlQuery +=
        "SELECT p.id, p.name, p.price, p.image, COUNT(*) FROM transactions t JOIN products p on t.products_id = p.id where lower(p.name) like lower('%' || $1 || '%') GROUP BY p.id, p.name, p.price, p.image ORDER BY COUNT(*) DESC LIMIT 10";
      value.push(name);
    }
    db.query(sqlQuery, value)
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

const deleteTransactionsFromUsers = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "UPDATE transactions SET deleted_at =$2 WHERE users_id = $1";
    const deletedDate = new Date(Date.now());
    db.query(sqlQuery, [id, deletedDate])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: "All transaction was successfully deleted",
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};
const deleteOneTransactionsFromUsers = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "UPDATE transactions SET deleted_at =$2 WHERE transaction_id = $1";
    const deletedDate = new Date(Date.now());
    db.query(sqlQuery, [id, deletedDate])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Transaction with id${id}  was successfully deleted`,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};
const deleteMultipleTransactionsFromUsers = (id) => {
  return new Promise((resolve, reject) => {
    // console.log(id.split(","));
    let arrayId = id.split(","); // const values = id;
    let queryId = "";
    // for (let i = 0; i < arrayId.length; i++) {
    //   i === arrayId.length + 1
    //     ? (queryId += "$" + i)
    //     : (queryId += "$" + i + ",");
    //   // i < arrayId.length
    //   //   ? (queryId += `'${arrayId[i]}', `)
    //   //   : (queryId += `'${arrayId[i]}'`);
    //   // paramid.push(queryId[i]);
    // }
    for (let i = 1; i <= arrayId.length; i++) {
      i === arrayId.length ? (queryId += "$" + i) : (queryId += "$" + i + ",");
    }

    console.log(queryId);
    console.log(arrayId);
    let sqlQuery = `UPDATE transactions SET deleted_at =now() WHERE id in(${queryId})`;
    // if (queryId.length > 1) {
    //   queryId.pop();
    // }
    // console.log(sqlQuery);
    db.query(sqlQuery, arrayId)
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Transaction with id${id}  was successfully deleted`,
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
  deleteTransactionsFromUsers,
  deleteOneTransactionsFromUsers,
  deleteMultipleTransactionsFromUsers,
};
