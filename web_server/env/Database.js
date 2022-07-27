const mysql = require("mysql2")

const PORT = 3306

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: PORT,
    database: "rmdb01"
});

db.connect((err) => {
    if (err)
        throw err
    console.log(`Database connected on localhost port ${PORT}`)
});