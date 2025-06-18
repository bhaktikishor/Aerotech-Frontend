const { createConnection } = require('mysql2');

const connection = createConnection({
    host: "localhost",
    user: "root",
    password: "Rudransh@23",
    database: "project",
})

module.exports = connection;


