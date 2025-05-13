import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AvailableSeats = () => {
  const { showtimeId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtimeDetails, setShowtimeDetails] = useState(null);
  // Fixed price per seat - in a real app this would come from the backend
  const PRICE_PER_SEAT = 12.99;
  const navigate = useNavigate();

  // Fetch showtime details
  useEffect(() => {
    if (!showtimeId || isNaN(parseInt(showtimeId))) {
      setError('Invalid showtime ID');
      setLoading(false);
      return;
    }

    // First get the showtime details
    axios.get(`http://localhost:5000/api/movies/showtime/${showtimeId}`)
      .then(response => {
        setShowtimeDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching showtime details:', error);
        setError('Error loading showtime details');
      });

    // Then get the available seats
    axios.get(`http://localhost:5000/api/movies/showtime/${showtimeId}/seats`)
      .then(response => {
        setSeats(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching seats:', error);
        setError('Error loading available seats');
        setLoading(false);
      });
  }, [showtimeId]);

  const handleSeatSelect = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    try {
      // Calculate total price based on selected seats
      const totalPrice = selectedSeats.length * PRICE_PER_SEAT;
      
      // Get the user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.user_id) {
        alert('Please log in to book tickets');
        navigate('/login'); // Redirect to login page
        return;
      }

      // Make the booking request
      const response = await axios.post(`http://localhost:5000/api/movies/book`, {
        user_id: user.user_id,
        showtime_id: parseInt(showtimeId),
        seats: selectedSeats,
        total_price: totalPrice
      });

      // Store booking confirmation in localStorage for the confirmation page
      localStorage.setItem('bookingConfirmation', JSON.stringify(response.data));
      
      // Navigate to confirmation page
      navigate('/confirmation');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div>Loading available seats...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="available-seats">
      <button onClick={() => navigate(-1)}>← Back</button>
      
      {showtimeDetails && (
        <div className="showtime-info">
          <h2>{showtimeDetails.movie_title}</h2>
          <p>Theater: {showtimeDetails.theater_name}</p>
          <p>Date: {new Date(showtimeDetails.show_date).toLocaleDateString()}</p>
          <p>Time: {showtimeDetails.show_time}</p>
        </div>
      )}
      
      <h3>Select Your Seats</h3>
      
      {seats.length === 0 ? (
        <p>No available seats found.</p>
      ) : (
        <div className="seat-grid">
          {seats.map((seat) => (
            <button
              key={seat.seat_id}
              className={`seat ${selectedSeats.includes(seat.seat_id) ? 'selected' : ''}`}
              onClick={() => handleSeatSelect(seat.seat_id)}
            >
              {seat.seat_number}
            </button>
          ))}
        </div>
      )}
      
      {selectedSeats.length > 0 && (
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Selected Seats: {selectedSeats.length}</p>
          <ul>
            {selectedSeats.map(seatId => {
              const seat = seats.find(s => s.seat_id === seatId);
              return <li key={seatId}>Seat #{seat.seat_number}</li>;
            })}
          </ul>
          <p>Price per seat: ${PRICE_PER_SEAT.toFixed(2)}</p>
          <p>Total: ${(selectedSeats.length * PRICE_PER_SEAT).toFixed(2)}</p>
          <button 
            className="book-button" 
            onClick={handleBooking}
          >
            Complete Booking
          </button>
        </div>
      )}

      <style jsx>{`
        .available-seats {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .showtime-info {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f0f0f0;
          border-radius: 5px;
        }
        
        .seat-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 10px;
          margin: 20px 0;
        }
        
        .seat {
          padding: 10px;
          border: 1px solid #ccc;
          background-color: #f9f9f9;
          cursor: pointer;
        }
        
        .seat.selected {
          background-color: #4CAF50;
          color: white;
        }
        
        .booking-summary {
          margin-top: 20px;
          padding: 15px;
          background-color: #f0f0f0;
          border-radius: 5px;
        }
        
        .book-button {
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .book-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default AvailableSeats;