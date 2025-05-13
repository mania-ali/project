import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TheaterSeating.css';

const TheaterSeating = () => {
  const { theaterId } = useParams();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!theaterId || theaterId === 'undefined') {
      setError('Invalid theater ID');
      setLoading(false);
      return;
    }

    const fetchSeatingLayout = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/movies/theater/${theaterId}/seating`);
        if (response.data && response.data.length > 0) {
          setSeats(response.data);
        } else {
          setError('No seating data found');
        }
      } catch (err) {
        setError('Failed to load seating layout');
        console.error('Error fetching seating layout:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatingLayout();
  }, [theaterId]);

  if (loading) return <div className="loading">Loading seating layout...</div>;
  if (error) return <div className="error">{error}</div>;

  // Group seats by row (assuming seat numbers are like A1, A2, B1, etc.)
  const rows = {};
  seats.forEach(seat => {
    const rowMatch = seat.seat_number.match(/^([A-Za-z]+)/);
    const row = rowMatch ? rowMatch[1] : 'Unknown';
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  return (
    <div className="theater-seating">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h2>Theater Seating Layout</h2>
      
      <div className="screen">SCREEN</div>
      
      <div className="seating-grid">
        {Object.entries(rows).map(([row, rowSeats]) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            {rowSeats.map(seat => (
              <div 
                key={seat.seat_id} 
                className={`seat ${seat.is_booked ? 'booked' : 'available'}`}
                title={`Seat ${seat.seat_number}`}
              >
                {seat.seat_number.replace(row, '')}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheaterSeating;