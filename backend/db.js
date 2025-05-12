const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER.split('\\')[0],
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: process.env.DB_SERVER.split('\\')[1],
        enableArithAbort: true
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => {
        console.error('Database connection failed: ', err);
    });

module.exports = {
    sql,
    pool,
    poolConnect
};