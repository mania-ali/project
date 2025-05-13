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
    
    if (!showtimeId || isNaN(parseInt(showtimeId))) {
      return res.status(400).json({ error: 'Invalid showtime ID' });
    }

    await db.poolConnect;

    const result = await db.pool.request()
      .input('ShowtimeID', db.sql.Int, parseInt(showtimeId))  // ✅ Make sure this matches the SP param
      .execute('GetAvailableSeats');

    console.log(`Found ${result.recordset.length} available seats`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching available seats:', err);
    res.status(500).json({ error: err.message });
  }
});

///////////////////////////////////////////////



// Add these routes to your existing movies.js file

// Book tickets
// Book tickets
router.post('/book', async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    
    // Extract booking details from request body
    const userId = req.body.userId || req.body.user_id;
    const showtimeId = req.body.showtimeId || req.body.showtime_id;
    const selectedSeatIds = req.body.selectedSeatIds || req.body.seats || req.body.selected_seat_ids;
    const totalPrice = req.body.totalPrice || req.body.total_price;
    
    console.log(`Booking tickets for user ${userId}, showtime ${showtimeId}`);
    
    // Validate required fields
    if (!userId || !showtimeId || !selectedSeatIds || !totalPrice) {
      console.error('Missing required booking information:', { 
        userId, 
        showtimeId, 
        selectedSeatIds: selectedSeatIds ? 'present' : 'missing', 
        totalPrice 
      });
      return res.status(400).json({ error: 'Missing required booking information' });
    }
    
    // Verify selectedSeatIds is an array
    if (!Array.isArray(selectedSeatIds) || selectedSeatIds.length === 0) {
      console.error('Invalid seat selection:', selectedSeatIds);
      return res.status(400).json({ error: 'No seats selected or invalid seat selection format' });
    }
    
    console.log(`Selected seats: ${selectedSeatIds.join(', ')}`);

    await db.poolConnect;
    
    // Start a transaction
    const transaction = new db.sql.Transaction(db.pool);
    await transaction.begin();
    
    try {
      // Generate a new booking ID
      const bookingIdResult = await transaction.request()
        .query('SELECT ISNULL(MAX(booking_id), 0) + 1 AS new_booking_id FROM Bookings');
      
      const bookingId = bookingIdResult.recordset[0].new_booking_id;
      console.log(`Generated new booking ID: ${bookingId}`);
      
      // Create the booking
      await transaction.request()
        .input('BookingID', db.sql.Int, bookingId)
        .input('UserID', db.sql.Int, parseInt(userId))
        .input('ShowtimeID', db.sql.Int, parseInt(showtimeId))
        .input('TotalPrice', db.sql.Decimal(10, 2), parseFloat(totalPrice))
        .execute('BookTicket');
      
      console.log(`Created booking #${bookingId} in Bookings table`);
      
      // Associate seats with the booking
      for (const seatId of selectedSeatIds) {
        // Generate a new booking_seat_id for each seat
        const bookingSeatIdResult = await transaction.request()
          .query('SELECT ISNULL(MAX(booking_seat_id), 0) + 1 AS new_booking_seat_id FROM Booking_Seats');
        
        const bookingSeatId = bookingSeatIdResult.recordset[0].new_booking_seat_id;
        
        // Insert with the new booking_seat_id
        await transaction.request()
          .query(`INSERT INTO Booking_Seats (booking_seat_id, booking_id, seat_id) 
                  VALUES (${bookingSeatId}, ${bookingId}, ${seatId})`);
                  
        console.log(`Associated seat #${seatId} with booking #${bookingId}`);
      }
      
      // Commit the transaction
      await transaction.commit();
      console.log(`Booking transaction committed successfully`);
      
      // Get booking confirmation details
      const confirmationResult = await db.pool.request()
        .input('BookingID', db.sql.Int, bookingId)
        .execute('GetBookingConfirmation');
      
      res.status(201).json({
        message: 'Booking successful',
        bookingId,
        confirmation: confirmationResult.recordset[0]
      });
      
    } catch (err) {
      // If there's an error, rollback the transaction
      await transaction.rollback();
      console.error('Transaction rolled back due to error:', err);
      throw err;
    }
    
  } catch (err) {
    console.error('Error booking tickets:', err);
    res.status(500).json({ error: err.message });
  }
});



// Get booking confirmation by booking ID
router.get('/booking/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    if (!bookingId || isNaN(parseInt(bookingId))) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }
    
    await db.poolConnect;
    
    const result = await db.pool.request()
      .input('BookingID', db.sql.Int, parseInt(bookingId))
      .execute('GetBookingConfirmation');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching booking confirmation:', err);
    res.status(500).json({ error: err.message });
  }
});



// Get booking history for a specific user
router.get('/user/:userId/bookings', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('✅ ROUTE HIT: /user/:userId/bookings');
    console.log('User ID:', userId);

    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    await db.poolConnect;

    const result = await db.pool.request()
      .input('user_id', db.sql.Int, parseInt(userId))
      .execute('Get_Booking_History');  // Make sure this SP exists in DB

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    console.log(`Fetched ${result.recordset.length} bookings for user ${userId}`);
    res.json(result.recordset);

  } catch (err) {
    console.error('Error fetching booking history:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/booking/:bookingId/cancel', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const user = JSON.parse(req.headers.user || '{}');

    if (!bookingId || isNaN(parseInt(bookingId))) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid booking ID' 
      });
    }

    await db.poolConnect;
    
    // Execute cancellation
    const result = await db.pool.request()
      .input('BookingID', db.sql.Int, parseInt(bookingId))
      .execute('Cancel_Ticket');

    const response = result.recordset[0];
    
    if (response.status === 'error') {
      return res.status(400).json({
        status: 'error',
        message: response.message
      });
    }

    // Get updated booking history
    const historyResult = await db.pool.request()
      .input('user_id', db.sql.Int, user.user_id)
      .execute('Get_Booking_History');

    res.status(200).json({
      status: 'success',
      message: response.message,
      updatedHistory: historyResult.recordset,
      showtimeId: response.showtime_id,
      seatsFreed: response.seats_freed
    });

  } catch (err) {
    console.error('Error cancelling ticket:', err);
    
    // Check if error came from stored procedure
    if (err.originalError?.info?.message) {
      return res.status(400).json({
        status: 'error',
        message: err.originalError.info.message
      });
    }
    
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to cancel ticket. Please try again.',
      details: err.message 
    });
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