const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const connection = require("../database")
const verifyToken = require("../middleware/auth")
const { addUserValidation } = require("../validation/user.validation")

const register = (req, res) => {
  let data = { first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password }

  let sqlQuery = "INSERT INTO user_data SET ?";

  connection.query(sqlQuery, data, (err, results) => {
    console.log(data);

    if (err) {
      res.status(400).json({
        status: false,
        message: "Your Email is Already Register",
      });
    } else {
      res.send({
        status: true,
        message: "New Account Is Created",
        data: data,
      });
    }
  })

};

const login = (req, res) => {
  let data = [req.body.email, req.body.password]
  let sqlQuery = "SELECT * FROM user_data WHERE email = ? AND password = ? ";

  connection.query(sqlQuery, data, (err, results) => {

    if (results.length <= 0) {
      res.status(400).json({
        status: false,
        message: "Invalid user id or password",
      });
    } else {
      console.log(results[0].id);

      const token = jwt.sign({ id: results[0].id }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      data.token = token;
      res.send({
        status: true,
        message: "You Have Successfully Logged",
        // data: results,
        token: token,
      });
    }
  })

};


router.post("/register", addUserValidation, register);

router.post("/login", login);

router.get("/get-user", verifyToken)

module.exports = router;
