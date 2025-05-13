import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const [confirmation, setConfirmation] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [cancelStatus, setCancelStatus] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const booking = JSON.parse(localStorage.getItem('bookingConfirmation'));
    if (booking) {
      setConfirmation(booking);
    }
  }, []);

  const fetchBookingHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:5000/api/movies/user/${user.user_id}/bookings`);
      setHistory(response.data);
      setShowHistory(true);
    } catch (error) {
      console.error('Error fetching booking history:', error);
    }
  };

  const handleCancelTicket = async () => {
    if (!confirmation?.bookingId) return;
    
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    setIsCancelling(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.delete(
        `http://localhost:5000/api/movies/booking/${confirmation.bookingId}/cancel`,
        { headers: { user: JSON.stringify(user) } }
      );
      
      if (response.data.status === 'error') {
        setCancelStatus({
          success: false,
          message: response.data.message
        });
        return;
      }
      
      setCancelStatus({
        success: true,
        message: response.data.message
      });
      
      // Update with server's fresh history data
      setHistory(response.data.updatedHistory);
      localStorage.removeItem('bookingConfirmation');
      setConfirmation(null);
      
    } catch (error) {
      setCancelStatus({
        success: false,
        message: error.response?.data?.message || 'Failed to cancel ticket'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const onReturnHome = () => {
    navigate('/');
  };

  // Helper function to format the date and time
  const formatShowtime = (dateString, timeString) => {
    try {
      // Handle cases where timeString might be in different formats
      let formattedTime = timeString;
      if (timeString.includes('1970-01-01')) {
        formattedTime = timeString.split('T')[1]?.split('.')[0] || '00:00';
      }
      
      const date = new Date(dateString);
      const timeParts = formattedTime.split(':');
      const time = new Date();
      time.setHours(parseInt(timeParts[0]) || 0);
      time.setMinutes(parseInt(timeParts[1]) || 0);
      
      return {
        date: date.toLocaleDateString(),
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch (error) {
      console.error('Error formatting date/time:', error);
      return {
        date: dateString,
        time: timeString
      };
    }
  };

  if (!confirmation) {
    return (
      <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
        <h2>Booking Cancelled</h2>
        {cancelStatus?.success && (
          <div style={{
            padding: '10px',
            margin: '10px 0',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '4px'
          }}>
            {cancelStatus.message}
          </div>
        )}
        <button onClick={onReturnHome}>Return to Homepage</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>🎟 Booking Confirmed!</h2>
      <p>Your booking ID is: <strong>{confirmation.bookingId}</strong></p>

      {cancelStatus && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          backgroundColor: cancelStatus.success ? '#d4edda' : '#f8d7da',
          color: cancelStatus.success ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {cancelStatus.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
        <button onClick={onReturnHome}>Return to Homepage</button>
        <button onClick={fetchBookingHistory}>
          {showHistory ? 'Hide History' : 'View Booking History'}
        </button>
        <button 
          onClick={handleCancelTicket} 
          disabled={isCancelling}
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white',
            opacity: isCancelling ? 0.7 : 1
          }}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Ticket'}
        </button>
      </div>

      {showHistory && (
        <div style={{ marginTop: '20px' }}>
          <h3>📜 Your Booking History:</h3>
          {history.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {history.map((booking) => {
                const { date, time } = formatShowtime(booking.show_date, booking.show_time);
                return (
                  <li 
                    key={booking.booking_id} 
                    style={{ 
                      padding: '10px',
                      margin: '5px 0',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      borderLeft: booking.booking_id === confirmation.bookingId ? '4px solid #28a745' : 'none'
                    }}
                  >
                    {booking.movie_title} at {booking.theater_name} on {date} at {time} | 
                    Seat: {booking.seat_id} | Price: ${booking.total_price}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No past bookings found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;