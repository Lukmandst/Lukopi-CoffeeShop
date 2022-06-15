const db = require("../config/database");

const getUsersFromServer = (query, route) => {
  return new Promise((resolve, reject) => {
    const { page = 1, limit = 3 } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    db.query("SELECT * FROM users LIMIT $1 OFFSET $2", [Number(limit), offset])
      .then((result) => {
        const response = {
          data: result.rows,
        };
        db.query("SELECT COUNT(*) AS total_user FROM users")
          .then((data) => {
            response.totalData = parseInt(data.rows[0]["total_user"]);
            response.totalPage = Math.ceil(
              response.totalData / parseInt(limit)
            );
            if (page < response.totalPage)
              response.nextPage = `/user${route.path}?page=${parseInt(page) + 1}`;
            if (offset > 0)
              response.previousPage = `/user${route.path}?page=${
                parseInt(page) - 1
              }`;
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

const getSingleUserFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "select * from users where id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject({ status: 404, err: "User Not Found" });
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

const findUser = (query, route) => {
  return new Promise((resolve, reject) => {
    const { name, gender, id, page = 1, limit = 3 } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const values = [name, gender, id, Number(limit), offset];
    let sqlQuery =
      "SELECT * FROM users WHERE lower(display_name) like lower('%' || $1 || '%') or lower(first_name) like lower('%' || $1 || '%') or lower(last_name) like lower('%' || $1 || '%') or lower(gender) = lower($2) or id =$3 LIMIT $4 OFFSET $5";
    // if (order) {
    //   sqlQuery += " order by " + sort + " " + order;
    // }
    db.query(sqlQuery, values)
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "User Not Found" });
        }
        const response = {
          data: result.rows,
          total: result.rowCount,
        };
        response.totalData = parseInt(result.rows[0][response.total]);
        response.totalPage = Math.ceil(response.totalData / parseInt(limit));
        if (page < response.totalPage)
          response.nextPage = `/user${route.path}?page=${parseInt(page) + 1}`;
        if (offset > 0)
          response.previousPage = `/user${route.path}?page=${parseInt(page) - 1}`;
        resolve(response);
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const createNewUser = (body) => {
  return new Promise((resolve, reject) => {
    const {
      first_name,
      last_name,
      display_name,
      email,
      phone_number,
      gender,
      birthdate,
      password,
      delivery_address,
      register_date,
    } = body;
    const sqlQuery =
      "INSERT INTO users (first_name, last_name, display_name, email, phone_number, gender, birthdate, pass, delivery_address, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    db.query(sqlQuery, [
      first_name,
      last_name,
      display_name,
      email,
      phone_number,
      gender,
      birthdate,
      password,
      delivery_address,
      register_date,
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

const updateUser = (id, body, file) => {
  return new Promise((resolve, reject) => {
    const {
      first_name,
      last_name,
      display_name,
      email,
      phone_number,
      gender,
      birthdate,
      delivery_address,
    } = body;
    const updated_at = new Date(Date.now());
    const photo = file
      ? file.path.replace("public", "").replace(/\\/g, "/")
      : null;
    const sqlQuery =
      "UPDATE users SET first_name= COALESCE($1, first_name), last_name= COALESCE($2, last_name), display_name= COALESCE($3, display_name), email= COALESCE($4, email), phone_number= COALESCE($5, phone_number), gender= COALESCE($6, gender), birthdate= COALESCE($7, birthdate),  delivery_address= COALESCE($8, delivery_address), updated_at = $10, picture = COALESCE(NULLIF($11, ''), picture) WHERE id=$9 RETURNING *";
    db.query(sqlQuery, [
      first_name,
      last_name,
      display_name,
      email,
      phone_number,
      gender,
      birthdate,
      delivery_address,
      id,
      updated_at,
      photo,
    ])
      .then((data) => {
        const response = {
          data: data.rows,
          msg: "Your data has been updated!",
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const updateImageUser = (id, file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject({ status: 400, err: "Image not found" });
    }
    const picture = file.path.replace("public", "").replace(/\\/g, "/");
    db.query("UPDATE users SET picture = $1 WHERE id = $2 RETURNING picture", [
      picture,
      id,
    ])
      .then((data) => {
        const response = {
          data: data.rows[0],
          msg: "Your Profile Picture has been updated!",
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

// const deleteUserFromServer = (id) => {
//   return new Promise((resolve, reject) => {
//     const sqlQuery = "DELETE FROM users where id = $1";
//     db.query(sqlQuery, [id])
//       .then((data) => {
//         const response = {
//           data: data.rows,
//           msg: `User with id= ${id} was successfully deleted`,
//         };
//         resolve(response);
//       })
//       .catch((err) => {
//         reject({ status: 500, err });
//       });
//   });
// };

module.exports = {
  getUsersFromServer,
  getSingleUserFromServer,
  findUser,
  createNewUser,
  updateUser,
  // deleteUserFromServer,
  updateImageUser,
};
