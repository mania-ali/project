import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    axios.get(`http://localhost:5000/api/history/${user.user_id}`)
      .then(res => setHistory(res.data))
      .catch(err => console.error('Error fetching booking history:', err));
  }, []);

  return (
    <div>
      <h2>Your Booking History</h2>
      <ul>
        {history.map((booking, index) => (
          <li key={index}>
            Movie: {booking.movie_title}, Seat: {booking.seat_number}, Showtime: {booking.showtime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingHistory;
