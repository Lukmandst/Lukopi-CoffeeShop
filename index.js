require("dotenv").config();
const express = require("express"); // import package express

const mainRouter = require("./src/routes");
const db = require("./src/config/database");
const { redisConn } = require("./src/config/redis");
const logger = require("morgan");
const cloudinaryConfig = require("./src/middlewares/cloudinary");

// create express application
const server = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
redisConn();
db.connect()
  .then(() => {
    console.log("DB Connected");
    server.use(
      logger(":method :url :status :res[content-length] - :response-time ms")
    );
    server.use(express.urlencoded({ extended: false })); // urlencoded
    server.use(express.json()); // application/json
    const corsOptions = {
      origin: [
        "*",
        "http://localhost:3000",
        "https://lukopi-coffeeshop.netlify.app",
      ],
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };
    server.use(cors(corsOptions));

    server.use(cloudinaryConfig);
    server.use(mainRouter);
    server.use(express.static("public"));

    server.listen(PORT, () => {
      console.log(`Server is running at PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
