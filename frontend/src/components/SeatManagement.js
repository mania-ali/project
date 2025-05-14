import React, { useState } from 'react';
import axios from 'axios';

const SeatManagement = () => {
  const [seatData, setSeatData] = useState({
    SeatID: '', // Now required (no NULL allowed)
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
      
      // Validate SeatID is provided (even for ADD)
      if (!seatData.SeatID) {
        throw new Error("Seat ID is required for all operations");
      }

      const response = await axios.post(
        'http://localhost:5000/api/adminActions/seats',
        seatData, // No longer converting SeatID to NULL
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert(response.data.message || 'Seat operation successful');
      
      // Reset form (but keep Action selection)
      setSeatData({
        SeatID: '',
        TheaterID: '',
        SeatNumber: '',
        Action: seatData.Action // Keep the current action
      });
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.response?.data?.error || error.message || 'Failed to perform operation'}`);
    }
  };

  return (
    <div className="seat-management">
      <h2>Manage Seats</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Seat ID (required):</label> {/* Updated label */}
          <input 
            type="number" 
            name="SeatID" 
            value={seatData.SeatID} 
            onChange={handleChange} 
            required // Makes field mandatory
          />
        </div>
        <div>
          <label>Theater ID:</label>
          <input 
            type="number" 
            name="TheaterID" 
            value={seatData.TheaterID} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Seat Number:</label>
          <input 
            type="text" 
            name="SeatNumber" 
            value={seatData.SeatNumber} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Action:</label>
          <select 
            name="Action" 
            value={seatData.Action} 
            onChange={handleChange}
          >
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