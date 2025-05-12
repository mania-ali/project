import './MovieDetails.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MovieDetails() {
  const { id } = useParams(); // movie_id from the URL
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/movies/${id}/details`);
        setMovieDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div>Loading movie details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="movie-details-container">
      <header>
        <button onClick={() => navigate(-1)}>← Back</button>
        <h1>{movieDetails.title}</h1>
      </header>
      <main>
        <p><strong>Genre:</strong> {movieDetails.genre}</p>
        <p><strong>Rating:</strong> {movieDetails.rating}</p>
        <p><strong>Duration:</strong> {movieDetails.duration} mins</p>
        <p><strong>Cast:</strong> {movieDetails.cast}</p>
        <p><strong>Synopsis:</strong> {movieDetails.synopsis}</p>

        {/* Add the View Showtimes button here */}
        <button 
          className="showtimes-button" 
          onClick={() => navigate(`/showtimes/${id}`)}  // Navigate to the showtimes page for this movie
        >
          View Showtimes
        </button>
      </main>
    </div>
  );
}

export default MovieDetails;