import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import Showtimes from './components/Showtimes';
import ShowtimeDetails from './components/ShowtimeDetails';
import AvailableSeats from './components/AvailableSeats';
import BookTickets from './components/BookTickets';
import BookingConfirmation from './components/BookingConfirmation';
import BookingHistory from './components/BookingHistory';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard'; // Import AdminDashboard

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'user' or 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const admin = localStorage.getItem('admin');

    if (token) {
      setIsAuthenticated(true);
      if (user) {
        setUserType('user');
      } else if (admin) {
        setUserType('admin');
      }
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
          path="/login" 
          element={
            isAuthenticated ? 
              (userType === 'admin' ? 
                <Navigate to="/admin-dashboard" /> : 
                <Navigate to="/" />) : 
              <Login setIsAuthenticated={setIsAuthenticated} setUserType={setUserType} />
          } 
        />
        
        {/* User Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated && userType === 'user' ? 
              <Home setIsAuthenticated={setIsAuthenticated} /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/movie/:id" 
          element={
            isAuthenticated && userType === 'user' ? 
              <MovieDetails /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/showtimes/:movieId" 
          element={
            isAuthenticated && userType === 'user' ? 
              <Showtimes /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/showtime/:showtimeId" 
          element={
            isAuthenticated && userType === 'user' ? 
              <ShowtimeDetails /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/showtime/:showtimeId/seats" 
          element={
            isAuthenticated && userType === 'user' ? 
              <AvailableSeats /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/book/:showtimeId" 
          element={
            isAuthenticated && userType === 'user' ? 
              <BookTickets /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/confirmation" 
          element={
            isAuthenticated && userType === 'user' ? 
              <BookingConfirmation /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/user/:userId/bookings" 
          element={
            isAuthenticated && userType === 'user' ? 
              <BookingHistory /> : 
              <Navigate to="/login" />
          } 
        />

        {/* Admin Routes */}
        <Route 
  path="/admin-dashboard" 
  element={
    isAuthenticated && userType === 'admin' ? 
      <AdminDashboard setIsAuthenticated={setIsAuthenticated} /> : 
      <Navigate to="/login" />
  } 
/>
        
        {/* Default redirect */}
        <Route path="*" element={<Navigate to={isAuthenticated ? (userType === 'admin' ? "/admin-dashboard" : "/") : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;