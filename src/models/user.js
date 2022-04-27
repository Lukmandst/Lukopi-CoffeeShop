const db = require("../config/database");

const getUsersFromServer = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users")
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

const getSingleUserFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "select * from users where user_id = $1";
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

const findUser = (query) => {
  return new Promise((resolve, reject) => {
    const { name, gender } = query;
    let sqlQuery =
      "select * from users where lower(user_display_name) like lower('%' || $1 || '%') or lower(user_first_name) like lower('%' || $1 || '%') or lower(user_last_name) like lower('%' || $1 || '%') or lower(user_gender) = lower($2)";
    // if (order) {
    //   sqlQuery += " order by " + sort + " " + order;
    // }
    db.query(sqlQuery, [name, gender])
      .then((result) => {
        if (result.rows.length === 0) {
          return reject({ status: 404, err: "User Not Found" });
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
      "INSERT INTO users (user_first_name, user_last_name, user_display_name, user_email, user_phone_number, user_gender, user_birthdate, user_password, user_delivery_address, user_register_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
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

// const updateUser = (id) => {
//     return new Promise((resolve, reject) => {
//       // const{user_}
//       const sqlQuery = "UPDATE users SET user_display_name=$1 where user_id = $2";
//       db.query(sqlQuery, [id])
//         .then((data) => {
//           if (data.rows.length === 0) {
//             return reject({ status: 404, err: "User Not Found" });
//           }
//           const response = {
//             data: data.rows,
//           };
//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
// };

const deleteUserFromServer = (id) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "DELETE FROM users where user_id = $1";
    db.query(sqlQuery, [id])
      .then((data) => {
        if (data.rows.length === 0) {
          return reject({ status: 404, err: "Product Not Found" });
        }
        const response = {
          data: data.rows,
          msg: `User with id= ${id} was succesfully deleted`,
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

module.exports = {
  getUsersFromServer,
  getSingleUserFromServer,
  findUser,
  createNewUser,
  // updateUser,
  deleteUserFromServer,
};
