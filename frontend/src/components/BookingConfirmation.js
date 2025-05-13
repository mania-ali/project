import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Your booking was successful!</h2>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default BookingConfirmation;
