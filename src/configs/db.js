require('dotenv').config();
const mysql = require('mysql2/promise');

const configConnection = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
};

const createConnection = async () => await mysql.createConnection(configConnection);

module.exports = {
    configConnection,
    createConnection
};