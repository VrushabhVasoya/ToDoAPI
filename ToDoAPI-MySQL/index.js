const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const users = require("./Routes/usersRoutes");
const router = require("./Routes/toDoRoutes");
const connection = require("./database")

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.use(express.json());

app.use("/users", users);

app.use("/todoapi", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connection.getConnection((err) => {
    if (!err) {
      connection.on('error', function (err) {
        console.log("mysql error", err);
      });
      console.log("database connected!!");
    }
  })
});
