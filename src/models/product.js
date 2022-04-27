const db = require("../config/database");

const getProductsFromServer = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM products")
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

const getSingleProductFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "select * from products where product_id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject({ status: 404, err: "Product Not Found" });
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

const findProduct = (query) => {
  return new Promise((resolve, reject) => {
    const { name, price, category, price_above, price_under, order, sort } =
      query;
    let sqlQuery =
      "select * from products where lower(product_name) like lower('%' || $1 || '%')  or product_price = $2 or product_category = $3 or product_price >= $4 or product_price <= $5";
    if (order) {
      sqlQuery += " order by " + sort + " " + order;
    }
    db.query(sqlQuery, [name, price, category, price_above, price_under])
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
      "INSERT INTO products (product_name, product_category, product_price, product_stock,  product_details, product_delivery_start, product_delivery_end) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
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
    const sqlQuery = "DELETE FROM products where product_id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject({ status: 404, err: "Product Not Found" });
        }
        const response = {
          data: data.rows,
          msg: `Product with id ${id} was succesfully deleted`,
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
    db.query("SELECT * FROM products ORDER BY product_id DESC")
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
  getSingleProductFromServer,
  findProduct,
  createNewProduct,
  deleteProductFromServer,
  sortProduct
};
