const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Add/Edit Movies
router.post('/movies', async (req, res) => {
  const { MovieID, Title, Genre, Rating, Synopsis, Duration, Cast } = req.body;

  try {
    await db.poolConnect;
    const result = await db.pool.request()
      .input('MovieID', db.sql.Int, MovieID || null)
      .input('Title', db.sql.VarChar(255), Title)
      .input('Genre', db.sql.VarChar(50), Genre)
      .input('Rating', db.sql.Decimal(3, 1), Rating)
      .input('Synopsis', db.sql.Text, Synopsis)
      .input('Duration', db.sql.Int, Duration)
      .input('Cast', db.sql.Text, Cast)
      .execute('Add_Edit_Movie');

    res.status(200).json({ message: 'Movie added/updated successfully' });
  } catch (err) {
    console.error('Error in Add/Edit Movie:', err);
    res.status(500).json({ error: 'Failed to add/edit movie', detail: err.message });
  }
});

// 2. Manage Showtimes
router.post('/showtimes', async (req, res) => {
  const { ShowtimeID, MovieID, TheaterID, ShowDate, ShowTime } = req.body;

  try {
    await db.poolConnect;
    const result = await db.pool.request()
      .input('ShowtimeID', db.sql.Int, ShowtimeID || null)
      .input('MovieID', db.sql.Int, MovieID)
      .input('TheaterID', db.sql.Int, TheaterID)
      .input('ShowDate', db.sql.Date, ShowDate)
      .input('ShowTime', db.sql.Time, ShowTime)
      .execute('Manage_Showtimes');

    res.status(200).json({ message: 'Showtime managed successfully' });
  } catch (err) {
    console.error('Error in Manage Showtimes:', err);
    res.status(500).json({ error: 'Failed to manage showtime', detail: err.message });
  }
});

// 3. Manage Seats
router.post('/seats', async (req, res) => {
  const { SeatID, TheaterID, SeatNumber, Action } = req.body;

  try {
    await db.poolConnect;
    const result = await db.pool.request()
      .input('SeatID', db.sql.Int, SeatID || null)
      .input('TheaterID', db.sql.Int, TheaterID)
      .input('SeatNumber', db.sql.VarChar(10), SeatNumber)
      .input('Action', db.sql.VarChar(10), Action)
      .execute('Manage_Seats');

    res.status(200).json({ message: `Seat ${Action === 'ADD' ? 'added' : 'removed'} successfully` });
  } catch (err) {
    console.error('Error in Manage Seats:', err);
    res.status(500).json({ error: 'Failed to manage seat', detail: err.message });
  }
});

module.exports = router;
