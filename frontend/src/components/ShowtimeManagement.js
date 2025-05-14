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

// Helper function to convert 12-hour to 24-hour format
const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    
    return `${hours}:${minutes}:00`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowtimeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  try {
    // Format time to HH:MM:SS
    let formattedTime = showtimeData.ShowTime;
    if (formattedTime && !formattedTime.includes(':')) {
      formattedTime = `${formattedTime}:00`; // Add seconds if missing
    }
    // Ensure 24-hour format
    if (formattedTime.includes('AM') || formattedTime.includes('PM')) {
      formattedTime = convertTo24Hour(formattedTime);
    }

    const formattedData = {
      ...showtimeData,
      ShowTime: formattedTime
    };

    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:5000/api/adminActions/showtimes',
      formattedData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        
      }
    );
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
        alert(`Error: ${error.response?.data?.error || error.message || 'Failed to perform operation'}`);
        console.log('Full error response:', error.response);
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
  <label>Show Time (24-hour format):</label>
  <input
    type="time"
    name="ShowTime"
    value={showtimeData.ShowTime}
    onChange={handleChange}
    step="1" // Allows seconds
    required
  />
</div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );

  
};

export default ShowtimeManagement;