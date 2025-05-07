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

async function testConnection() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT 1 AS number');
        console.log(result.recordset);
        await pool.close();
    } catch (err) {
        console.error('Connection error:', err);
    }
}

testConnection();
