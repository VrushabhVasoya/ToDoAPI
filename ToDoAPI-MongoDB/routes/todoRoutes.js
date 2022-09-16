const express = require("express");
const router = express.Router();
const Model = require("../model/todoModel")
const verifyToken = require('../middleware/auth')

router.post("/create", verifyToken, async (req, res) => {
    try {
        const decodedId = req.decoded;

        const data = new Model({
            user_id: decodedId.id,
            task: req.body.task, complete: req.body.complete
        })
        const dataToSave = await data.save()
        res.status(200).json(dataToSave)

    } catch (error) {
        res.status(422).json({
            msg: "error is true",
        });
    }
})

router.get("/user", verifyToken, async (req, res) => {
    try {
        const decodedId = req.decoded;
        const user = await Model.find({ user_id: decodedId.id })
        res.send(user)
    } catch (error) {
        res.status(422).json({
            msg: "error is true",
        });
    }
})

router.put("/update/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true }
        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )
        res.send(result)
    } catch (error) {
        res.status(422).json({
            msg: "error is true",
        });
    }
})
router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        await Model.findByIdAndDelete(id)
        res.send({
            status: true,
            message: "Your ToDo has been deleted",
        });
    } catch (error) {
        res.status(404).json({ msg: "error is true" })
    }
})

module.exports = router;
