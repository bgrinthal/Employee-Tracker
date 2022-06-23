const mysql = require('mysql2');
const util = require("util");

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'password',
        database: 'tracker_db'
    },
    console.log(`Connected to the courses_db database.`)
);

db.query = util.promisify(db.query);

module.exports = db;