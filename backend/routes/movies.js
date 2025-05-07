const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all movies
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all movies...');
    await db.poolConnect;
    
    const result = await db.pool.request()
      .query('SELECT * FROM Movies');
      
    console.log(`Found ${result.recordset.length} movies`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get movie details by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.poolConnect;
    
    const result = await db.pool.request()
      .input('id', db.sql.Int, id)
      .query('SELECT * FROM Movies WHERE movie_id = @id');
      
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;