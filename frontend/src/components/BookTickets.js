import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookTickets.css';

const BookTickets = () => {
  const { showtimeId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtimeInfo, setShowtimeInfo] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || { user_id: 1 }; // Fallback to user_id 1 if not found

  useEffect(() => {
    const fetchSeatsAndShowtime = async () => {
      try {
        setLoading(true);
        
        // Get available seats for this showtime
        const seatRes = await axios.get(`http://localhost:5000/api/movies/showtime/${showtimeId}/seats`);
        setSeats(seatRes.data);
        
        // Get showtime details
        const showtimeRes = await axios.get(`http://localhost:5000/api/movies/showtime/${showtimeId}`);
        setShowtimeInfo(showtimeRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load seat information. Please try again.');
        setLoading(false);
      }
    };

    fetchSeatsAndShowtime();
  }, [showtimeId]);

  const toggleSeat = (seatId) => {
    const PRICE_PER_SEAT = 12.99; // Fixed price per seat
    
    const alreadySelected = selectedSeats.includes(seatId);
    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      setTotalPrice(prevPrice => prevPrice - PRICE_PER_SEAT);
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
      setTotalPrice(prevPrice => prevPrice + PRICE_PER_SEAT);
    }
  };

  const bookTickets = async () => {
    try {
      // Show loading or disable button during booking
      setLoading(true);
      
      const response = await axios.post('http://localhost:5000/api/movies/book', {
        userId: user.user_id,
        showtimeId: parseInt(showtimeId),
        selectedSeatIds: selectedSeats,
        totalPrice: parseFloat(totalPrice.toFixed(2))
      });
      
      // Store the booking confirmation in localStorage
      localStorage.setItem('bookingConfirmation', JSON.stringify(response.data));
      
      // Navigate to confirmation page
      navigate('/confirmation');
    } catch (err) {
      console.error('Error booking tickets:', err);
      setError(`Booking failed: ${err.response?.data?.error || err.message}`);
      setLoading(false);
    }
  };

  if (loading && !seats.length) return <div className="loading">Loading seat information...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="book-tickets">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      
      <h2>Select Your Seats</h2>
      
      {showtimeInfo && (
        <div className="showtime-info">
          <h3>{showtimeInfo.movie_title}</h3>
          <p><strong>Theater:</strong> {showtimeInfo.theater_name}</p>
          <p><strong>Date:</strong> {new Date(showtimeInfo.show_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {showtimeInfo.show_time}</p>
        </div>
      )}

      <div className="seat-selection">
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-box available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box unavailable"></div>
            <span>Unavailable</span>
          </div>
        </div>
        
        <div className="screen">SCREEN</div>
        
        <div className="seats-grid">
          {seats.map(seat => (
            <div
              key={seat.seat_id}
              className={`seat ${selectedSeats.includes(seat.seat_id) ? 'selected' : ''}`}
              onClick={() => toggleSeat(seat.seat_id)}
            >
              {seat.seat_number}
            </div>
          ))}
        </div>
      </div>

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <p><strong>Selected Seats:</strong> {selectedSeats.length > 0 ? 
          selectedSeats.map(seatId => {
            const seat = seats.find(s => s.seat_id === seatId);
            return seat ? seat.seat_number : '';
          }).join(', ') : 'None'}
        </p>
        <p><strong>Price per seat:</strong> $12.99</p>
        <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
        
        <button 
          className="book-button" 
          disabled={selectedSeats.length === 0 || loading}
          onClick={bookTickets}
        >
          {loading ? 'Processing...' : 'Complete Booking'}
        </button>
      </div>
      
      <style jsx>{`
        .book-tickets {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .back-button {
          background: none;
          border: none;
          color: #4CAF50;
          font-size: 16px;
          cursor: pointer;
          padding: 5px 0;
          margin-bottom: 20px;
        }
        
        .showtime-info {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        
        .seat-selection {
          margin: 20px 0;
        }
        
        .seat-legend {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          margin: 0 10px;
        }
        
        .legend-box {
          width: 20px;
          height: 20px;
          margin-right: 5px;
          border-radius: 3px;
        }
        
        .legend-box.available {
          background-color: #f0f0f0;
          border: 1px solid #ccc;
        }
        
        .legend-box.selected {
          background-color: #4CAF50;
          border: 1px solid #45a049;
        }
        
        .legend-box.unavailable {
          background-color: #ccc;
          border: 1px solid #999;
        }
        
        .screen {
          background-color: #ddd;
          color: #333;
          text-align: center;
          padding: 5px;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        
        .seats-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .seat {
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 3px;
          padding: 10px 5px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .seat:hover {
          background-color: #e0e0e0;
        }
        
        .seat.selected {
          background-color: #4CAF50;
          color: white;
          border-color: #45a049;
        }
        
        .booking-summary {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
        
        .book-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
          width: 100%;
        }
        
        .book-button:hover:not(:disabled) {
          background-color: #45a049;
        }
        
        .book-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          font-size: 18px;
        }
        
        .error {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
};

export default BookTickets;