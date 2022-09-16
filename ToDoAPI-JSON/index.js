const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const fs = require("fs");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { addUserValidation } = require("./validation/user.validation");
const auth = require("./middleware/auth");
const todoData = require("./todoData.json");
const { url } = require("inspector");
const { path } = require("@hapi/joi/lib/errors");

const app = express();

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.use(express.json());

app.post("/register", addUserValidation, (req, res) => {
  const jsonString = req.body;

  let rawuserstats = fs.readFileSync(__dirname + "/users.json", "utf8");
  const userstats = JSON.parse(rawuserstats);

  const foundUser = userstats.find(
    (m) => m.email === req.body.email || m.password === req.body.password
  );

  if (foundUser) {
    res.status(400).json({
      success: false,
      message: "user alredy exits",
    });
  } else if (!foundUser) {
    fs.readFile("users.json", (err, data) => {
      const userId = uuidv4();
      const jsonData = JSON.parse(data);

      const firstname = req.body.firstname;
      const lastname = req.body.lastname;
      const email = req.body.email;
      const password = req.body.password;

      res.send(jsonString);
      jsonData.push({ userId, firstname, lastname, email, password });
      fs.writeFile("users.json", JSON.stringify(jsonData), (err) => {
        if (err) throw err;
      });
    });
  }
});

app.post("/login", (req, res) => {
  const jsonString = req.body;

  let rawuserstats = fs.readFileSync(__dirname + "/users.json", "utf8");
  const userstats = JSON.parse(rawuserstats);
  console.log(userstats);

  const foundUser = userstats.find(
    (m) => m.email === req.body.email && m.password === req.body.password
  );

  if (foundUser) {
    const token = jwt.sign({ email: req.body.email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    jsonString.token = token;

    res.status(200).send({
      email: req.body.email,
      password: req.body.password,
      success: true,
      message: "You are successfully logged in",
      token: token,
    });
  } else if (!foundUser) {
    res.status(400).send({
      success: false,
      message: "You have not registered, please register first ",
    });
  }
});
app.post("/welcome", auth, (req, res) => {
  res.status(200).send("welcome to my own world");
});

app.post("/create", (req, res) => {
  fs.readFile("todoData.json", (err, data) => {
    const id = uuidv4();
    const jsonData = JSON.parse(data);
    const task = req.body.task;
    const date = new Date();

    res.send({ task: task, date: date });
    jsonData.push({ id, task, date });

    fs.writeFile("todoData.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
});
app.get("/user/:id", (req, res) => {
  let rawuserstats = fs.readFileSync(__dirname + "/todoData.json", "utf8");
  const userstats = JSON.parse(rawuserstats);

  const foundUser = userstats.find((m) => m.id === req.params.id);

  if (!foundUser) {
    res.send({
      status: false,
      message: "Invalid user id",
    });
  } else if (foundUser) {
    res.send({
      status: true,
      message: "user get data successfully",
      data: foundUser,
    });
  }
});

app.put("/update/:id", (req, res) => {
  let rawuserstats = fs.readFileSync(__dirname + "/todoData.json", "utf8");
  const userstats = JSON.parse(rawuserstats);

  const foundUser = userstats.find((m) => m.id === req.params.id);

  if (!foundUser) {
    res.send({
      err: true,
      message: "enter the right email id",
    });
  } else if (foundUser) {
    fs.readFile("todoData.json", (err, data) => {
      const jsonData = JSON.parse(data);

      for (const obj of jsonData) {
        if (obj.id === foundUser.id) {
          obj.task = req.body.task;
          break;
        }
      }
      // const newArr = jsonData.map((obj) => {
      //   if (obj.id === foundUser.id) {
      //     return { ...obj, task: req.body.task };
      //   }
      //   return obj;
      // });
      console.log(jsonData);
      res.send(req.body);
      fs.writeFile("todoData.json", JSON.stringify(jsonData), (err) => {
        if (err) throw err;
      });
    });
  }
});

app.delete("/delete/:id", (req, res) => {
  let rawuserstats = fs.readFileSync(__dirname + "/todoData.json", "utf8");
  const userstats = JSON.parse(rawuserstats);

  const foundUser = userstats.find((m) => m.id === req.params.id);

  if (!foundUser) {
    res.send({
      err: true,
      message: "enter the right email id",
    });
  } else if (foundUser) {
    fs.readFile("todoData.json", (err, data) => {
      const jsonData = JSON.parse(data);

      const newArr = jsonData.filter((object) => {
        return object.id !== req.params.id;
      });

      console.log(jsonData);
      res.send({
        status: true,
        message: "value jas been removed",
      });
      fs.writeFile("todoData.json", JSON.stringify(newArr), (err) => {
        if (err) throw err;
      });
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
