import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import Showtimes from './components/Showtimes';
import ShowtimeDetails from './components/ShowtimeDetails';
import AvailableSeats from './components/AvailableSeats';
import BookTickets from './components/BookTickets';
import BookingConfirmation from './components/BookingConfirmation';
import BookingHistory from './components/BookingHistory'; // ✅ New import

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/Login" />} 
        />
        <Route 
          path="/movie/:id" 
          element={isAuthenticated ? <MovieDetails /> : <Navigate to="/Login" />} 
        />
        <Route 
          path="/showtimes/:movieId" 
          element={isAuthenticated ? <Showtimes /> : <Navigate to="/Login" />} 
        />
        <Route 
          path="/showtime/:showtimeId" 
          element={isAuthenticated ? <ShowtimeDetails /> : <Navigate to="/Login" />} 
        />
        <Route 
          path="/showtime/:showtimeId/seats" 
          element={isAuthenticated ? <AvailableSeats /> : <Navigate to="/Login" />} 
        />
        <Route 
          path="/book/:showtimeId" 
          element={isAuthenticated ? <BookTickets /> : <Navigate to="/Login" />} 
        />
        <Route 
          path="/confirmation" 
          element={isAuthenticated ? <BookingConfirmation /> : <Navigate to="/Login" />} 
        />
        <Route 
          path="/user/:userId/bookings" 
          element={isAuthenticated ? <BookingHistory /> : <Navigate to="/Login" />} 
        /> {/* ✅ Added BookingHistory route */}
      </Routes>
    </Router>
  );
}

export default App;
