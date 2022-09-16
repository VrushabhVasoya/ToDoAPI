const mysql = require("mysql");

const connection = mysql.createPool({
    host: 'localhost',
    user: 'sqluser',
    password: 'password',
    database: 'employee_database',
})

module.exports = connection;