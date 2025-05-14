import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Home({ setIsAuthenticated }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/Login');
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
        {/* ✅ Logout Button */}
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="main-content">
        <section className="movies-section">
          <h2>Available Movies</h2>
          <div className="movie-grid">
            {movies.map(movie => (
              <div className="movie-card" key={movie.movie_id}>
                <h3>{movie.title}</h3>
                <p className="genre">{movie.genre}</p>
                <Link to={`/movie/${movie.movie_id}`} className="view-details-btn">View Details</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
