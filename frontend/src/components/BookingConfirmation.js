import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get confirmation data from localStorage
    const confirmationData = localStorage.getItem('bookingConfirmation');
    
    if (confirmationData) {
      setConfirmation(JSON.parse(confirmationData));
    } else {
      // No confirmation data found, redirect to homepage
      navigate('/');
    }
  }, [navigate]);

  const viewBookingHistory = () => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { user_id: 1 };
    navigate(`/booking-history/${user.user_id}`);
  };

  if (!confirmation) {
    return <div>Loading confirmation...</div>;
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="ticket-header">
          <h1>Booking Confirmation</h1>
          <div className="confirmation-number">
            <span>Booking ID: {confirmation.bookingId}</span>
          </div>
        </div>

        <div className="ticket-details">
          <h2>{confirmation.confirmation.movie_title}</h2>
          <div className="detail-row">
            <div className="detail-item">
              <span className="label">Theater</span>
              <span className="value">{confirmation.confirmation.theater_name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Date</span>
              <span className="value">{new Date(confirmation.confirmation.show_date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-item">
              <span className="label">Time</span>
              <span className="value">{confirmation.confirmation.show_time}</span>
            </div>
            <div className="detail-item">
              <span className="label">Customer</span>
              <span className="value">{confirmation.confirmation.customer_name}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-item">
              <span className="label">Total Price</span>
              <span className="value">${parseFloat(confirmation.confirmation.total_price).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="ticket-footer">
          <p>Thank you for your booking!</p>
          <p>Please arrive 15 minutes before showtime.</p>
          <div className="button-group">
            <button className="home-button" onClick={() => navigate('/')}>Return to Homepage</button>
            <button className="history-button" onClick={viewBookingHistory}>View Booking History</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .confirmation-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f0f0;
          padding: 20px;
        }
        
        .confirmation-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
          overflow: hidden;
        }
        
        .ticket-header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
        }
        
        .confirmation-number {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          padding: 5px 10px;
          display: inline-block;
          margin-top: 10px;
        }
        
        .ticket-details {
          padding: 20px;
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
        
        .ticket-footer {
          border-top: 1px dashed #ddd;
          padding: 20px;
          text-align: center;
        }
        
        .button-group {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 15px;
        }
        
        .home-button, .history-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .history-button {
          background-color: #2196F3;
        }
        
        .home-button:hover {
          background-color: #45a049;
        }
        
        .history-button:hover {
          background-color: #0b7dda;
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;