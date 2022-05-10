const { v4: uudiV4 } = require("uuid");
const db = require("../config/database");

const signUp = (email, hashedPass) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "INSERT INTO users( id, email, pass, created_at)VALUES($1, $2, $3, $4)";
    const id = uudiV4();
    const timestamp = new Date(Date.now());
    const values = [id, email, hashedPass, timestamp];
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
    const sqlQuery = "SELECT email FROM users WHERE email = $1";
    db.query(sqlQuery, [email])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject({ status: 500, err });
      });
  });
};
module.exports = { signUp, getUserByEmail };
