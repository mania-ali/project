const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all movies using Browse_Movies stored procedure
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all movies...');
    await db.poolConnect;

    const result = await db.pool.request()
      .execute('Browse_Movies');

    console.log(`Found ${result.recordset.length} movies`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get movie details by movie_id
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    await db.poolConnect;

    const result = await db.pool.request()
      .input('movie_id', db.sql.Int, id)
      .execute('Get_Movie_Details');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get showtimes for a movie by movie_id
router.get('/:id/showtimes', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching showtimes for movie:", id);

    await db.poolConnect;

    const result = await db.pool.request()
      .input('movie_id', db.sql.Int, id)
      .execute('Get_Show_times');

    console.log("Showtimes fetched:", result.recordset);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No showtimes available for this movie' });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching showtimes:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
