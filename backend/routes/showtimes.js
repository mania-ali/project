const express = require('express');
const router = express.Router();
const db = require('../db');

// Get showtimes by movie_id using the Get_Show_times stored procedure
router.get('/:movieId', async (req, res) => {
    try {
      const { movieId } = req.params;
      console.log("Received movieId:", movieId); // LOG HERE
  
      await db.poolConnect;
  
      const result = await db.pool.request()
        .input('movie_id', db.sql.Int, movieId)
        .execute('Get_Show_times');
  
      console.log("Stored procedure result:", result.recordset); // LOG RESULT
  
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
