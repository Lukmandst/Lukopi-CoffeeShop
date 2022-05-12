const db = require("../config/database");

const getProductsFromServer = (query) => {
  return new Promise((resolve, reject) => {
    const { page = 1, limit = 5 } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    db.query("SELECT * FROM products ORDER BY name LIMIT $1 OFFSET $2", [
      Number(limit),
      offset,
    ])
      .then((result) => {
        const response = {
          data: result.rows,
        };
        db.query("SELECT COUNT(*) AS total_product FROM products")
          .then((result) => {
            response.totalData = parseInt(result.rows[0]["total_product"]);
            response.totalPage = Math.ceil(
              response.totalData / parseInt(limit)
            );
            resolve(response);
          })
          .catch((err) => {
            reject({ status: 500, err });
          });
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

// const getSingleProductFromServer = (id) => {
//   return new Promise((resolve, reject) => {
//     const sqlQuery = "select * from products where id = $1";
//     db.query(sqlQuery, [id])
//       .then((data) => {
//         if (data.rows.length === 0) {
//           return reject({ status: 404, err: "Product Not Found" });
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

const findProduct = (query) => {
  return new Promise((resolve, reject) => {
    const { name, price, category, price_above, price_under, order, sort, id } =
      query;
    let sqlQuery =
      "select name, price, categories_id from products where lower(name) like lower('%' || $1 || '%')  or price = $2 or categories_id = $3 or price >= $4 or price <= $5 or id = $6";
    if (order) {
      sqlQuery += " order by " + sort + " " + order;
    }
    db.query(sqlQuery, [name, price, category, price_above, price_under, id])
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "Product Not Found" });
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

const createNewProduct = (body) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      category,
      price,
      stock,
      details,
      delivery_start,
      delivery_end,
    } = body;
    const sqlQuery =
      "INSERT INTO products (name, categories_id, price, stock, details, delivery_start, delivery_end) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    db.query(sqlQuery, [
      name,
      category,
      price,
      stock,
      details,
      delivery_start,
      delivery_end,
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

const deleteProductFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "DELETE FROM products where id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Product with id ${id} was successfully deleted`,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const updateProduct = (id, body) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      category,
      price,
      stock,
      details,
      delivery_start,
      delivery_end,
    } = body;
    const sqlQuery =
      "UPDATE products SET name= COALESCE($1, name), categories_id= COALESCE($2, categories_id), price= COALESCE($3, price), stock= COALESCE($4, stock), details= COALESCE($5, details), delivery_start= COALESCE($6, delivery_start), delivery_end= COALESCE($7, delivery_end) WHERE id=$8 RETURNING *";
    db.query(sqlQuery, [
      name,
      category,
      price,
      stock,
      details,
      delivery_start,
      delivery_end,
      id,
    ])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: `Product with id ${id} has been updated`,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const sortProduct = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM products ORDER BY id DESC")
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

const sortByPrice = (query) => {
  return new Promise((resolve, reject) => {
    const { sort } = query;
    let sqlQuery = "SELECT * FROM products ORDER BY price";
    if (sort) {
      sqlQuery += " " + sort;
    }
    db.query(sqlQuery)
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
  getProductsFromServer,
  // getSingleProductFromServer,
  findProduct,
  createNewProduct,
  updateProduct,
  deleteProductFromServer,
  sortProduct,
  sortByPrice,
};
