const express = require("express");
const router = express.Router();
const connection = require("../database")
const jwt = require("jsonwebtoken");
const config = process.env;

// connection.getConnection(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   let sql = `CREATE TABLE todo_data (id INT AUTO_INCREMENT PRIMARY KEY, task VARCHAR(255) NOT NULL, complete BOOLEAN NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT NOW(),
//   updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now())`;
//   connection.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   })
// });

const createToDo = (req, res) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
      res.status(422).json({
        message: "Please provide the token",
      });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, config.TOKEN_KEY);

    let data = { user_id: decoded.id, task: req.body.task, complete: req.body.complete }
    let sqlQuery = "INSERT INTO todo_data SET ?";

    connection.query(sqlQuery, data, (err, results) => {
      // console.log(data);
      // console.log(err);

      if (!err) {
        res.send({
          status: true,
          message: "You Have Sucessfully Created ToDo",
          data: data,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Error is Occured",
        });
      }
    })
  } catch (err) {
    res.status(404).json({
      message: "Please Enter the valid token",
    });
  }
};

const getuser = (req, res) => {

  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
      res.status(404).json({
        message: "Please Enter the token",
      });
    }
    const theToken = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(theToken, config.TOKEN_KEY);
    console.log(decoded.id);

    let sqlQuery = "SELECT * FROM todo_data where user_id=? ";

    connection.query(sqlQuery, decoded.id, (err, results) => {
      console.log(err);

      if (!results.length) {
        res.send({
          status: false,
          message: "Invalid user id",
        });
      } else {
        res.send({
          status: true,
          message: "User Show Data Successfully",
          data: results,
        });
      }
    })
  } catch (err) {
    res.status(404).json({
      message: "Please Enter the valid token",
    });
  }

};


const updateToDo = (req, res) => {

  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
      res.status(422).json({
        message: "Please provide the token",
      });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, config.TOKEN_KEY);

    let sqy = "SELECT * FROM todo_data where id=? ";
    connection.query(sqy, req.params.id, (err, results) => {
      console.log(decoded.id);
      console.log(results);

      // id is not in database
      if (results.length <= 0) {
        res.status(422).json({
          message: "Invalid Authorization",
        });
      }
      //verify token
      else if (decoded.id === results[0].user_id) {

        console.log(parseInt(req.params.id));
        console.log(results[0].id);

        let data = [req.body.task, req.body.complete, req.params.id]
        let sqlQuery = 'UPDATE todo_data SET task = ?, complete=? WHERE id = ?'
        connection.query(sqlQuery, data, (err, results) => {

          if (results.length <= 0) {
            res.send({
              status: false,
              message: "Invalid user id",
            });
          } else {
            res.send({
              status: true,
              message: "User Update ToDo Successfully",
              data: req.body,
            });
          }
        })
      } else {
        res.status(404).json({
          message: "Invalid Authorization",
        });
      }

    })

  } catch (err) {
    res.status(404).json({
      message: "Please Enter the valid token",
    });
  }
};

const deleteToDo = (req, res) => {

  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
      res.status(422).json({
        message: "Please provide the token",
      });
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, config.TOKEN_KEY);

    let sqy = "SELECT * FROM todo_data where id=? ";
    connection.query(sqy, req.params.id, (err, results) => {
      if (results.length <= 0) {
        res.status(404).json({
          message: "Invalid Authorization",
        });
      }

      else if (decoded.id === results[0].user_id) {

        let sqlQuery = "DELETE FROM todo_data WHERE id=" + req.params.id + "";
        connection.query(sqlQuery, (err, results) => {

          if (err) {
            res.send({
              status: false,
              message: "Invalid user id",
            });
          } else {
            res.send({
              status: true,
              message: "Your ToDo has been deleted",
            });
          }
        })
      }
      else {
        res.status(404).json({
          message: "Invalid Authorization",
        });
      }
    })
  } catch (err) {
    res.status(404).json({
      message: "Please Enter the valid token",
    });
  }

};

router.post("/create", createToDo);

router.get("/user", getuser);

router.put("/update/:id", updateToDo);

router.delete("/delete/:id", deleteToDo);

module.exports = router;

