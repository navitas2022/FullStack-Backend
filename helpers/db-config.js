const mysql = require('mysql');

const db = mysql.createPool({
    host: 'navmysqlserver.mysql.database.azure.com',
    user: 'navpocuser',
    password: 'Test@123',
    database: 'posts',
    multipleStatements: true
});

module.exports = db;