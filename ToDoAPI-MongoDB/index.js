require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const user = require("./routes/userRoutes")
const router = require("./routes/todoRoutes")

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


app.use(express.json());
app.use('/user', user)
app.use("/todo", router)

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})