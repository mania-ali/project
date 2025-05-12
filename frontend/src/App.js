import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import Showtimes from './components/Showtimes';
import ShowtimeDetails from './components/ShowtimeDetails';

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
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />} 
        />
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
      </Routes>
    </Router>
  );
}

export default App;