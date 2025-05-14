import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // We'll create this next

const Header = ({ handleLogout }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Movie Ticket Booking</Link>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/booking-history" className="nav-link">My Bookings</Link>
      </nav>
      <div className="user-section">
        <span className="welcome-text">Welcome, {user.name || 'User'}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;