const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connect = require("./database/connection.js");
const router = require("./router/router.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const port = 8080;

app.get("/", (req, res) => {
  res.status(201).json("Server is running");
});

app.use("/api", router);

connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Connected to ${port}`);
      });
    } catch (error) {
      console.log("Unable to connect server.");
    }
  })
  .catch((error) => {
    console.log("Unable to connect DB");
  });
