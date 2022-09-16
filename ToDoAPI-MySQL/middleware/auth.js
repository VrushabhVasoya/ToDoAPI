const jwt = require("jsonwebtoken");
const connection = require("../database")

const verifyToken = (req, res) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer') ||
      !req.headers.authorization.split(' ')[1]
    ) {
      res.status(422).json({
        message: "Please provide the token",
      });
    }
    const theToken = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(theToken, process.env.TOKEN_KEY);
    console.log(decoded.id);

    connection.query('SELECT * FROM user_data where id=?', decoded.id, function (error, results, fields) {
      if (error) throw error;
      res.send({ error: false, data: results[0], message: 'Fetch Successfully.' });
    })
  } catch (err) {
    res.status(422).json({
      message: "Please Enter the valid token",
    });
  }
};

module.exports = verifyToken;

