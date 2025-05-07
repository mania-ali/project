const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        console.log('Waiting for database connection...');
        await db.poolConnect;
        console.log('Database connection successful! Running query...');
        const result = await db.pool.request().query('SELECT * FROM users');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: err.message, fullError: err });
    }
});

module.exports = router;
