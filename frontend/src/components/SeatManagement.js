import React, { useState } from 'react';
import axios from 'axios';

const SeatManagement = () => {
  const [seatData, setSeatData] = useState({
    SeatID: '',
    TheaterID: '',
    SeatNumber: '',
    Action: 'ADD'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeatData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/seats', seatData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(response.data.message || 'Seat operation successful');
      setSeatData({
        SeatID: '',
        TheaterID: '',
        SeatNumber: '',
        Action: 'ADD'
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.response?.data?.error || 'Failed to perform seat operation'}`);
    }
  };

  return (
    <div className="seat-management">
      <h2>Manage Seats</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Seat ID (leave empty for new seat):</label>
          <input type="number" name="SeatID" value={seatData.SeatID} onChange={handleChange} />
        </div>
        <div>
          <label>Theater ID:</label>
          <input type="number" name="TheaterID" value={seatData.TheaterID} onChange={handleChange} required />
        </div>
        <div>
          <label>Seat Number:</label>
          <input type="text" name="SeatNumber" value={seatData.SeatNumber} onChange={handleChange} required />
        </div>
        <div>
          <label>Action:</label>
          <select name="Action" value={seatData.Action} onChange={handleChange}>
            <option value="ADD">Add Seat</option>
            <option value="REMOVE">Remove Seat</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SeatManagement;