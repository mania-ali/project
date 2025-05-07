import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // We'll create this next

function Home({ setIsAuthenticated }) {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch movies from backend
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/movies');
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>Movie Ticket Booking System</h1>
        <div className="user-section">
          {user && <span>Welcome, {user.name}</span>}
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="main-content">
        <section className="movies-section">
          <h2>Available Movies</h2>
          <div className="movie-grid">
            {movies.map(movie => (
              <div className="movie-card" key={movie.movie_id}>
                <div className="movie-poster">
                  <div className="placeholder-poster">{movie.title.charAt(0)}</div>
                </div>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="genre">{movie.genre}</p>
                  <div className="movie-details">
                    <span className="rating">⭐ {movie.rating}/10</span>
                    <span className="duration">{movie.duration} mins</span>
                  </div>
                  <button className="book-btn">Book Tickets</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;