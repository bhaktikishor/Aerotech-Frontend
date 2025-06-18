const { createConnection } = require('mysql2');

const connection = createConnection({
    host: "localhost",
    user: "root",
    password: "Rudransh@23",
    database: "aerotech",
})

module.exports = connection;


