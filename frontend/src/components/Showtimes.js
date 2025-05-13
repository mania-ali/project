// Fixed Showtimes.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Showtimes.css';

const Showtimes = () => {
  const { movieId } = useParams();
  const [showtimes, setShowtimes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("movieId from URL:", movieId);
    axios.get(`http://localhost:5000/api/movies/${movieId}/showtimes`)
      .then(response => {
        console.log("Showtimes response:", response.data);
        setShowtimes(response.data);
      })
      .catch(error => console.error('Error fetching showtimes:', error));
  }, [movieId]);

  const handleShowtimeClick = (showtimeId) => {
    console.log("Navigating to showtime ID:", showtimeId);
    navigate(`/showtime/${showtimeId}`);
  };

  return (
    <div className="showtimes">
      <h2>Available Showtimes</h2>
      {showtimes.length === 0 ? (
        <p>No showtimes available for this movie.</p>
      ) : (
        <ul>
          {showtimes.map((show) => (
            <li key={show.showtimeid} onClick={() => handleShowtimeClick(show.showtimeid)}>
              <strong>{show.theatre_name}</strong> - {new Date(show.showdate).toLocaleDateString()} at {new Date(show.show_time).toLocaleTimeString()}<br />
              <small>{show.theatre_address}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Showtimes; 