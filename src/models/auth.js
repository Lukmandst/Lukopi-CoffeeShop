const { v4: uuidV4 } = require("uuid");
const db = require("../config/database");

const signUp = (email, hashedPass, phone) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "INSERT INTO users( id, email, pass, created_at, phone_number, role)VALUES($1, $2, $3, $4 ,$5, $6)";
    const id = uuidV4();
    const timestamp = new Date(Date.now());
    const role = "member";
    const values = [id, email, hashedPass, timestamp, phone, role];
    db.query(sqlQuery, values)
      .then(() => {
        const response = {
          msg: "Sign Up Success!",
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
      "SELECT id, display_name, pass, role FROM users WHERE email=$1";
    const result = await db.query(sqlQuery, [email]);
    if (result.rowCount === 0)
      throw { status: 400, err: { msg: "Email is not registered" } };
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (error) {
    const { status = 500, err } = error;
    throw { status, err };
  }
};
module.exports = { signUp, getUserByEmail, getInfobyUserEmail };
