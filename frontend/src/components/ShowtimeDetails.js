import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ShowtimeDetails.css';

const ShowtimeDetails = () => {
  const { showtimeId } = useParams();
  const [showtimeDetails, setShowtimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching details for showtimeId:", showtimeId);
    
    // Make sure showtimeId is actually a number and not undefined or null
    if (!showtimeId || showtimeId === 'undefined') {
      console.error('Invalid showtimeId:', showtimeId);
      setError('Invalid showtime ID');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    axios.get(`http://localhost:5000/api/movies/showtime/${showtimeId}`)
      .then(response => {
        console.log("Showtime details response:", response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          console.warn("Empty response:", response.data);
          setError('No showtime details found');
        } else {
          setShowtimeDetails(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching showtime details:', error);
        setError('Error loading showtime details');
        setLoading(false);
      });
  }, [showtimeId]);

  if (loading) return <div className="loading">Loading showtime details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!showtimeDetails) return <div className="not-found">Showtime not found</div>;

  // Format the date and time properly
  const formattedDate = new Date(showtimeDetails.show_date).toLocaleDateString();
  const formattedTime = new Date(`1970-01-01T${showtimeDetails.show_time.split('T')[1]}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="showtime-details">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h2>Showtime Details</h2>
      <div className="detail-card">
        <h3>{showtimeDetails.movie_title}</h3>
        <p><strong>Theater:</strong> {showtimeDetails.theater_name}</p>
        <p><strong>Date:</strong> {formattedDate}</p>
        <p><strong>Time:</strong> {formattedTime}</p>
        <button className="book-button" onClick={() => navigate(`/booking/${showtimeId}`)}>
          Book Seats
        </button>
      </div>
    </div>
  );
};

export default ShowtimeDetails;