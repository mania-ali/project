import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingHistory = () => {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/movies/user/${userId}/bookings`);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking history:', err);
        setError(`Failed to load booking history: ${err.response?.data?.error || err.message}`);
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="loading">Loading booking history...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="booking-history-page">
      <div className="booking-history-header">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h1>Your Booking History</h1>
      </div>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
          <button className="explore-button" onClick={() => navigate('/')}>Explore Movies</button>
        </div>
      ) : (
        <div className="bookings-container">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.booking_id}>
              <div className="booking-header">
                <h3>{booking.movie_title}</h3>
                <span className="booking-id">Booking #{booking.booking_id}</span>
              </div>
              
              <div className="booking-details">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Theater</span>
                    <span className="value">{booking.theater_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Date</span>
                    <span className="value">{formatDate(booking.show_date)}</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="label">Time</span>
                    <span className="value">{booking.show_time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Total Price</span>
                    <span className="value">${parseFloat(booking.total_price).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="seats-container">
                  <span className="label">Seats</span>
                  <div className="seats-list">
                    {booking.seats && booking.seats.split(',').map((seat, index) => (
                      <span className="seat-badge" key={index}>{seat.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .booking-history-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .booking-history-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        
        .back-button {
          background: none;
          border: none;
          color: #4CAF50;
          font-size: 16px;
          cursor: pointer;
          padding: 5px 0;
          margin-bottom: 10px;
        }
        
        h1 {
          font-size: 28px;
          margin: 0;
        }
        
        .no-bookings {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
        }
        
        .explore-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 15px;
        }
        
        .explore-button:hover {
          background-color: #45a049;
        }
        
        .bookings-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .booking-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .booking-header {
          background-color: #4CAF50;
          color: white;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .booking-header h3 {
          margin: 0;
          font-size: 18px;
        }
        
        .booking-id {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .booking-details {
          padding: 15px;
        }
        
        .detail-row {
          display: flex;
          margin-bottom: 15px;
        }
        
        .detail-item {
          flex: 1;
        }
        
        .label {
          display: block;
          color: #666;
          font-size: 0.9em;
          margin-bottom: 5px;
        }
        
        .value {
          font-weight: bold;
          font-size: 1.1em;
        }
        
        .seats-container {
          margin-top: 10px;
        }
        
        .seats-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }
        
        .seat-badge {
          background-color: #f0f0f0;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 14px;
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

export default BookingHistory;