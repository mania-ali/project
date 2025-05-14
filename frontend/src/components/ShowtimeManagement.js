import React, { useState } from 'react';
import axios from 'axios';

const ShowtimeManagement = () => {
  const [showtimeData, setShowtimeData] = useState({
    ShowtimeID: '',
    MovieID: '',
    TheaterID: '',
    ShowDate: '',
    ShowTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowtimeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/showtimes', showtimeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(response.data.message || 'Showtime saved successfully');
      setShowtimeData({
        ShowtimeID: '',
        MovieID: '',
        TheaterID: '',
        ShowDate: '',
        ShowTime: ''
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.response?.data?.error || 'Failed to save showtime'}`);
    }
  };
  return (
    <div className="showtime-management">
      <h2>Manage Showtimes</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Showtime ID (leave empty for new showtime):</label>
          <input type="number" name="ShowtimeID" value={showtimeData.ShowtimeID} onChange={handleChange} />
        </div>
        <div>
          <label>Movie ID:</label>
          <input type="number" name="MovieID" value={showtimeData.MovieID} onChange={handleChange} required />
        </div>
        <div>
          <label>Theater ID:</label>
          <input type="number" name="TheaterID" value={showtimeData.TheaterID} onChange={handleChange} required />
        </div>
        <div>
          <label>Show Date:</label>
          <input type="date" name="ShowDate" value={showtimeData.ShowDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Show Time:</label>
          <input type="time" name="ShowTime" value={showtimeData.ShowTime} onChange={handleChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ShowtimeManagement;