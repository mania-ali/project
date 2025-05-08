import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShowtimeDetails.css';

const ShowtimeDetails = () => {
  const { movieId } = useParams(); // Get movieId from URL params
  const [showtimes, setShowtimes] = useState([]);
  const navigate = useNavigate();

  // Fetch showtimes based on movieId
  useEffect(() => {
    axios.get(`http://localhost:5000/api/showtimes/${movieId}`)  // Use movieId to fetch showtimes
      .then(response => setShowtimes(response.data))
      .catch(error => console.error('Error fetching showtimes:', error));
  }, [movieId]);

  if (showtimes.length === 0) return <div>No showtimes available</div>;

  return (
    <div className="showtime-details">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h2>Available Showtimes</h2>
      {showtimes.map((showtime) => (
        <div key={showtime.showtime_id}>
          <p><strong>Theater:</strong> {showtime.theater_name}</p>
          <p><strong>Date:</strong> {new Date(showtime.show_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date(showtime.show_time).toLocaleTimeString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ShowtimeDetails;
