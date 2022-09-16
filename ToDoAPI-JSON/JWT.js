const jwt = require("jsonwebtoken");

const createToken = async () => {
  const token = await jwt.sign(
    { id: "1" },
    "mynameisvrushabhvasoyadeveloperexhibyte"
  );
  const uservar = await jwt.verify(
    token,
    "mynameisvrudfcshabhvasoyadeveloperexhibyte"
  );
  console.log(uservar);
};
