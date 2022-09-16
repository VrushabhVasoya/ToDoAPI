const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer') || !req.headers.authorization.split(' ')[1]) {
            res.status(422).json({
                message: "Please provide the token",
            });
        }
        const theToken = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(theToken, process.env.TOKEN_KEY);
        req.decoded = decoded
        return next();

    } catch (error) {
        res.status(422).json({
            message: "Please Enter the valid token",
        });
    }
}
module.exports = verifyToken
