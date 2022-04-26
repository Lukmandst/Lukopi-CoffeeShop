const db = require("../config/database");

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

const getSinglePromoFromServer = (id) => {
  return new Promise((resolve, reject) => {
    // parameterized query
    const sqlQuery = "select * from promos where promo_id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject({ status: 404, err: "Promo Not Found" });
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

const findPromo = (query) => {
  return new Promise((resolve, reject) => {
    // asumsikan query berisikan title, order, sort
    const {
      name, //1
      code, //2
      discount, //3
      product_size, //4
      buy_method, //5
      discount_above, //6
      discount_less, //7
    } = query;
    let sqlQuery =
      "select * from promos where lower(promo_name) like lower('%' || $1 || '%') or lower(promo_code) like lower('%' || $2 || '%') or promo_discount = $3 or size_id = $4 or method_id =$5 or promo_discount > $6 or promo_discount < $7";
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
    const {
      name,
      code,
      discount,
      date_start,
      date_end,
      product_size,
      buy_method,
    } = body;
    const sqlQuery =
      "INSERT INTO promos(promo_name, promo_code, promo_discount, promo_date_start, promo_date_end, size_id, method_id)VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    db.query(sqlQuery, [
      name,
      code,
      discount,
      date_start,
      date_end,
      product_size,
      buy_method,
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

const deletePromoFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "DELETE FROM promos where promo_id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Promo with id ${id} was succesfully deleted`,
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
  getSinglePromoFromServer,
  findPromo,
  createNewPromo,
  deletePromoFromServer,
};
