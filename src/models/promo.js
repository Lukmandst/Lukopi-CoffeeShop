const db = require("../config/database");
const { v4: uuidV4 } = require("uuid");
const getPromoFromServer = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM promos")
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

// const getSinglePromoFromServer = (id) => {
//   return new Promise((resolve, reject) => {
//     const sqlQuery = "select * from promos where id = $1";
//     db.query(sqlQuery, [id])
//       .then((data) => {
//         if (data.rows.length === 0) {
//           return reject({ status: 404, err: "Promo Not Found" });
//         }
//         const response = {
//           data: data.rows,
//         };
//         resolve(response);
//       })
//       .catch((err) => {
//         reject({ status: 500, err });
//       });
//   });
// };

const findPromo = (query) => {
  return new Promise((resolve, reject) => {
    const {
      id,
      name, //1
      code, //2
      discount, //3
      product_size, //4
      buy_method, //5
      discount_above, //6
      discount_less, //7
    } = query;
    let sqlQuery =
      "select * from promos where lower(name) like lower('%' || $1 || '%') or lower(code) like lower('%' || $2 || '%') or discount = $3 or sizes_id = $4 or delivery_id =$5 or discount > $6 or discount < $7 or id = $8";
    // if (order) {
    //   sqlQuery += " order by " + sort + " " + order;
    // }
    db.query(sqlQuery, [
      name,
      code,
      discount,
      product_size,
      buy_method,
      discount_above,
      discount_less,
      id,
    ])
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "Promo Not Found" });
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

const createNewPromo = (body) => {
  return new Promise((resolve, reject) => {
    const { name, code, discount, date_end } = body;
    console.log(body);
    const id = uuidV4();
    const sqlQuery =
      "INSERT INTO promos (id, name, code, discount, date_end) VALUES($1, $2, $3, $4, $5) returning *";
    db.query(sqlQuery, [id, name, code, discount, date_end])
      .then(({ rows }) => {
        const response = {
          data: rows[0],
        };
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject({ status: 500, err });
      });
  });
};

const updatePromo = (id, body) => {
  return new Promise((resolve, reject) => {
    const {
      name, //1
      code, //2
      discount, //3
      product_size, //4
      buy_method, //5
      promo_start, //6
      promo_end, //7
    } = body;
    const sqlQuery =
      "UPDATE promos SET name= COALESCE($1, name), code= COALESCE($2, code), discount= COALESCE($3, discount), sizes_id= COALESCE($4, sizes_id), delivery_id= COALESCE($5, delivery_id), start= COALESCE($6, start), end= COALESCE($7, end) WHERE promo_id=$8 RETURNING *";
    db.query(sqlQuery, [
      name, //1
      code, //2
      discount, //3
      product_size, //4
      buy_method, //5
      promo_start, //6
      promo_end, //7
      id, // 8
    ])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Promo with id ${id} has been updated`,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const deletePromoFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "DELETE FROM promos where id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Promo with id ${id} was successfully deleted`,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

module.exports = {
  getPromoFromServer,
  // getSinglePromoFromServer,
  findPromo,
  createNewPromo,
  updatePromo,
  deletePromoFromServer,
};
