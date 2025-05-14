import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieManagement from './MovieManagement';
import ShowtimeManagement from './ShowtimeManagement';
import SeatManagement from './SeatManagement';

const AdminDashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="admin-sections">
        <div className="admin-section">
          <MovieManagement />
        </div>
        <div className="admin-section">
          <ShowtimeManagement />
        </div>
        <div className="admin-section">
          <SeatManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
