const db = require("../config/database");
const { v4: uuidV4 } = require("uuid");

const getProductsFromServer = (
  query
  // route
) => {
  return new Promise((resolve, reject) => {
    const {
      order,
      sort,
      // page = 1,
      // limit = 10
    } = query;
    // const offset = (parseInt(page) - 1) * parseInt(limit);
    let sqlQuery = "SELECT * FROM products";
    if (order) {
      sqlQuery += " order by " + sort + " " + order;
    }
    // if (page) {
    //   sqlQuery += " LIMIT " + Number(limit) + " OFFSET " + offset;
    // }
    db.query(sqlQuery)
      .then((result) => {
        const response = {
          data: result.rows,
        };
        // db.query("SELECT COUNT(*) AS total_product FROM products")
        //   .then((result) => {
        //     response.totalData = parseInt(result.rows[0]["total_product"]);
        //     response.totalPage = Math.ceil(
        //       response.totalData / parseInt(limit)
        //     );
        //     if (page < response.totalPage)
        //       response.nextPage = `/product${route.path}?page=${
        //         parseInt(page) + 1
        //       }`;
        //     if (offset > 0)
        //       response.previousPage = `/product${route.path}?page=${
        //         parseInt(page) - 1
        //       }`;
        resolve(response);
        ////})
        // .catch((err) => {
        //   reject({ status: 500, err });
        // });
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getSingleProductFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "select * from products where id = $1";
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

const findProduct = (
  query
  //  route
) => {
  return new Promise((resolve, reject) => {
    const {
      name,
      price,
      category,
      price_above,
      price_under,
      order,
      sort,
      id,
      // page = 1,
      // limit = 2,
    } = query;
    // const offset = (parseInt(page) - 1) * parseInt(limit);
    let sqlQuery =
      "select * from products where lower(name) like lower('%' || $1 || '%')  or price = $2 or categories_id = $3 or price >= $4 or price <= $5 or id = $6";
    if (order) {
      sqlQuery += " order by " + sort + " " + order;
    }
    // if (page) {
    //   sqlQuery += " LIMIT " + Number(limit) + " OFFSET " + offset;
    // }
    // console.log(sqlQuery);
    // console.log(Array.isArray(query));
    // console.log(typeof query);
    // console.log(Object.values(query));
    // let objq = Object.entries(query);
    // console.log(objq);
    // console.log("from " + Object.fromEntries(objq));
    // let paramInput = `${Object.keys(query)}=${Object.values(query)}`; // only for 1 param
    // console.log(paramInput);

    db.query(sqlQuery, [name, price, category, price_above, price_under, id])
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "Product Not Found" });
        }
        const response = {
          total: result.rowCount,
          data: result.rows,
        };
        console.log("bawah");
        // db.query(
        //   "select * from products where lower(name) like lower('%' || $1 || '%')  or price = $2 or categories_id = $3 or price >= $4 or price <= $5 or id = $6",
        //   [name, price, category, price_above, price_under, id]
        // )
        //   .then((result) => {
        //     response.totalData = parseInt(result.rowCount);
        //     response.totalPage = Math.ceil(
        //       response.totalData / parseInt(limit)
        //     );
        //     if (page < response.totalPage)
        //       response.nextPage = `/product${route.path}?page=${
        //         parseInt(page) + 1
        //       }&${paramInput}`;
        //     if (offset > 0)
        //       response.previousPage = `/product${route.path}?page=${
        //         parseInt(page) - 1
        //       }${paramInput}`;
        resolve(response);
        // })
        // .catch((err) => {
        //   reject({ status: 500, err });
        // });
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const createNewProduct = (body, file) => {
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
    const id = uuidV4();
    // const image = file.path.replace("public", "").replace(/\\/g, "/");
    const image = file.path;
    // if (image === null || image=== undefined || image === 0 ) {
    //   return reject({ status: 400, err: "Image not found" });
    // }
    const sqlQuery =
      "INSERT INTO products (id, name, categories_id, price, stock, details, delivery_start, delivery_end, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    db.query(sqlQuery, [
      id,
      name,
      category,
      price,
      stock,
      details,
      delivery_start,
      delivery_end,
      image,
    ])
      .then(({ rows }) => {
        const response = {
          data: rows[0],
          // msg: "New product succesfully added!",
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

const updateProduct = (id, body, file) => {
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
    // const image = file
    //   ? file.path.replace("public", "").replace(/\\/g, "/")
    //   : null;
    const image = file ? file.path : null;
    const sqlQuery =
      "UPDATE products SET name= COALESCE($1, name), categories_id= COALESCE($2, categories_id), price= COALESCE($3, price), stock= COALESCE($4, stock), details= COALESCE($5, details), delivery_start= COALESCE($6, delivery_start), delivery_end= COALESCE($7, delivery_end), image = COALESCE(NULLIF($9,''), image) WHERE id=$8 RETURNING *";
    db.query(sqlQuery, [
      name,
      category,
      price,
      stock,
      details,
      delivery_start,
      delivery_end,
      id,
      image,
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
  getSingleProductFromServer,
  findProduct,
  createNewProduct,
  updateProduct,
  deleteProductFromServer,
  sortProduct,
  sortByPrice,
};
