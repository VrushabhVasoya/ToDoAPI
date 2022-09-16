const express = require("express");
const router = express.Router();
const Model = require('../model/model');
const { authSchema } = require("../middleware/validation")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/auth")

router.post("/register", async (req, res) => {
    try {
        await authSchema.validateAsync(req.body)
        let user = await Model.findOne({ email: req.body.email })
        if (user) {
            res.status(400).send('That user already exisits!');
        } else {
            const user = new Model({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password

            })
            const dataToSave = await user.save()
            res.status(200).json(dataToSave)
        }
    } catch (error) {
        if (error.isJoi === true) {
            res.send(error.details[0].message)
        }
    }
})

router.post("/login", async (req, res) => {

    try {

        let user = await Model.find({
            email: req.body.email,
            password: req.body.password
        })
        if (user <= 0) {
            res.status(404).json({ status: false, message: "Incorrect email or password" })
        } else {
            const token = jwt.sign({ id: user[0].id }, process.env.TOKEN_KEY, { expiresIn: "2m", })
            user.token = token
            res.send({
                status: true,
                message: "You Have Successfully Logged",
                token: token
            })
        }
    } catch (error) {
        res.status(404).json({ error: true })
    }
})

router.get("/getuser", async (req, res) => {
    try {
        const decoded = await verifyToken(req)
        const user = await Model.findById(decoded.id)
        res.send(user)
    } catch (error) {
        res.status(422).json({
            message: "Please Enter the valid token",
        });
    }
})



module.exports = router;