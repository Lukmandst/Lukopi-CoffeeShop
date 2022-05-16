require("dotenv").config();
const express = require("express"); // import package express

const mainRouter = require("./src/routes");
const db = require("./src/config/database");
const logger = require("morgan");
// create express application
const server = express();
const PORT = 8080;

db.connect()
  .then(() => {
    console.log("DB Connected");
    server.use(
      logger(":method :url :status :res[content-length] - :response-time ms")
    );
    server.use(express.urlencoded({ extended: false })); // urlencoded
    server.use(express.json()); // application/json
    server.use(mainRouter);
    server.use(express.static("public"));

    server.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
