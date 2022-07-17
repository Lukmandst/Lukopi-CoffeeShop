const { v4: uuidV4 } = require("uuid");
const db = require("../config/database");

const signUp = (email, hashedPass, phone) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "INSERT INTO users( id, email, pass, created_at, phone_number, roles_id, status)VALUES($1, $2, $3, now() ,$4, $5,'pending') returning email";
    const id = uuidV4();
    const roles_id = 1;
    const values = [id, email, hashedPass, phone, roles_id];
    db.query(sqlQuery, values)
      .then((result) => {
        const response = {
          data: result.rows[0],
          msg: "Sign Up Success! Please Check email for verification",
        };
        resolve(response);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "SELECT display_name, email FROM users WHERE email = $1";
    db.query(sqlQuery, [email])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};

const getInfobyUserEmail = async (email) => {
  try {
    const sqlQuery =
      "SELECT id, pass, roles_id, status FROM users WHERE email=$1";
    const result = await db.query(sqlQuery, [email]);
    if (result.rowCount === 0)
      throw { status: 400, err: { msg: "Email is not registered" } };
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    throw { status: error.status ? error.status : 500, msg: error.message };
  }
};
const verifyEmail = async (email) => {
  try {
    let sqlQuery =
      "UPDATE users SET status='active' WHERE email=$1 RETURNING status";
    const result = await db.query(sqlQuery, [email]);
    if (!result.rowCount) throw { status: 404, msg: "User Not Found" };
    return {
      data: result.rows[0],
    };
  } catch (err) {
    console.log(err);
    throw { status: err.status ? err.status : 500, msg: err.message };
  }
};
const updatePasswordWithEmail = (hashedPass, email) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "UPDATE users SET pass=$1, updated_at=now() WHERE email=$2";
    const values = [hashedPass, email];
    db.query(sqlQuery, values)
      .then(() => {
        const response = {
          msg: "Password has been updated",
        };
        resolve(response);
      })
      .catch((error) => {
        reject({
          status: 500,
          error,
        });
      });
  });
};
module.exports = {
  signUp,
  getUserByEmail,
  getInfobyUserEmail,
  verifyEmail,
  updatePasswordWithEmail,
};
