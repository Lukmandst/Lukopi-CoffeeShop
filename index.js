require("dotenv").config();
const express = require("express"); // import package express

const mainRouter = require("./src/routes");
const db = require("./src/config/database");
// create express application
const server = express();
const PORT = 8080;

db.connect()
  .then(() => {
    console.log("DB Connected");
    server.use(express.urlencoded({ extended: false }));
    server.use(express.json());
    server.use(mainRouter);

    server.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
