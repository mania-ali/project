import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/showtime/${showtimeId}/seats`)
      .then(res => setSeats(res.data))
      .catch(err => console.error('Error fetching seats:', err));
  }, [showtimeId]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post(`http://localhost:5000/api/book`, {
        user_id: user.user_id,
        showtime_id: showtimeId,
        seats: selectedSeats
      });
      navigate('/confirmation');
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed');
    }
  };

  return (
    <div>
      <h2>Select Your Seats</h2>
      <div className="seat-grid">
        {seats.map(seat => (
          <button 
            key={seat.seat_id} 
            className={selectedSeats.includes(seat.seat_id) ? 'selected' : ''}
            onClick={() => handleSeatSelect(seat.seat_id)} 
            disabled={!seat.is_available}
          >
            {seat.seat_number}
          </button>
        ))}
      </div>
      <button onClick={handleBooking} disabled={selectedSeats.length === 0}>
        Book Selected Seats
      </button>
    </div>
  );
};

export default SeatSelection;
