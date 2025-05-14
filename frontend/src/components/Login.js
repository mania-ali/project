import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated, setUserType }) => {
  const navigate = useNavigate();

  // User login state
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userError, setUserError] = useState('');

  // Admin login state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setUserError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: userEmail,
        password: userPassword
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      setUserType('user');
      navigate('/');
    } catch (err) {
      setUserError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email: adminEmail,
        password: adminPassword
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      setIsAuthenticated(true);
      setUserType('admin');
      navigate('/admin-dashboard');
    } catch (err) {
      setAdminError(err.response?.data?.message || 'Admin login failed.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-box user-login">
        <h2>User Login</h2>
        <form onSubmit={handleUserLogin}>
          {userError && <div className="error-message">{userError}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              placeholder="User email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
              placeholder="User password"
            />
          </div>
          <button type="submit" className="login-button">Login as User</button>
        </form>
      </div>

      <div className="login-form-box admin-login">
        <h2>Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
          {adminError && <div className="error-message">{adminError}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
              placeholder="Admin email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              placeholder="Admin password"
            />
          </div>
          <button type="submit" className="login-button">Login as Admin</button>
        </form>
      </div>
    </div>
  );
};

export default Login;