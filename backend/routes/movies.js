const express = require('express');
const router = express.Router();
const db = require('../db');

///////////////////////////////////////////////
// Specific showtime routes (placed first to avoid route conflicts)

// Get showtime details by showtimeId
router.get('/showtime/:showtimeId', async (req, res) => {
  console.log('✅ ROUTE HIT: /showtime/:showtimeId');
  console.log('Full URL:', req.originalUrl);
  console.log('Params:', req.params);

  try {
    const { showtimeId } = req.params;
    
    // Validate showtimeId is a number
    if (!showtimeId || isNaN(parseInt(showtimeId))) {
      console.error('Invalid showtime ID:', showtimeId);
      return res.status(400).json({ error: 'Invalid showtime ID' });
    }

    console.log(`Fetching details for showtime ID: ${showtimeId}`);
    await db.poolConnect;

    // FIXED: Changed parameter name to match stored procedure parameter (@showtime_id instead of @ShowtimeID)
    const result = await db.pool.request()
      .input('showtime_id', db.sql.Int, parseInt(showtimeId))
      .execute('Select_Show_time');

    console.log('Showtime details result:', result.recordset);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching showtime details:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get available seats for a showtime
router.get('/showtime/:showtimeId/seats', async (req, res) => {
  try {
    const { showtimeId } = req.params;
    console.log(`Fetching available seats for showtime ID: ${showtimeId}`);
    
    // Validate showtimeId is a number
    if (!showtimeId || isNaN(parseInt(showtimeId))) {
      console.error('Invalid showtime ID:', showtimeId);
      return res.status(400).json({ error: 'Invalid showtime ID' });
    }

    await db.poolConnect;

    // Note: Your stored procedure might expect a different parameter name here too
    // Check if it's 'ShowtimeID' or 'showtime_id' in your GetAvailableSeats stored procedure
    const result = await db.pool.request()
      .input('ShowtimeID', db.sql.Int, parseInt(showtimeId))
      .execute('GetAvailableSeats');

    console.log(`Found ${result.recordset.length} available seats`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching available seats:', err);
    res.status(500).json({ error: err.message });
  }
});

///////////////////////////////////////////////
// Movie routes

// Get all movies
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
    console.log("Request URL:", req.originalUrl);
    console.log("Params:", req.params);

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

// Get showtimes for a movie by movie_id
router.get('/:id/showtimes', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching showtimes for movie:", id);
    console.log("Request URL:", req.originalUrl);
    console.log("Params:", req.params);

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