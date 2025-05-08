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

  return (
    <div className="showtimes">
      <h2>Available Showtimes</h2>
      <ul>
        {showtimes.map((show, index) => (
          <li key={index} onClick={() => navigate(`/showtime/${show.showtime_id}`)}>
            <strong>{show.theatre_name}</strong> - {show.showdate} at {show.show_time}<br />
            <small>{show.theatre_address}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Showtimes;
