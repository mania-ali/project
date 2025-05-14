const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    await db.poolConnect;
    
    const result = await db.pool.request()
      .input('email', db.sql.VarChar, email)
      .input('password', db.sql.VarChar, password) // NOTE: hash if necessary
      .query('SELECT * FROM Admins WHERE email = @email AND password_hash = @password');
    
    const admin = result.recordset[0];
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Remove sensitive data before sending
    const { password_hash, ...adminWithoutPassword } = admin;
    
    // Create session if session middleware is properly configured
    if (req.session) {
      req.session.admin = adminWithoutPassword;
      req.session.isAdmin = true;
    }
    
    // Send response with admin data and isAdmin flag
    res.status(200).json({ 
      message: 'Admin logged in successfully',
      admin: adminWithoutPassword,
      isAdmin: true,
      token: 'admin-token-' + admin.admin_id // In a real app, use JWT
    });
    
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin Dashboard (session protected)
router.get('/dashboard', (req, res) => {
  // Check for either session or token-based auth
  if (!req.session?.admin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  
  res.send('Welcome to Admin Dashboard');
});

// Logout (for both admin and user)
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.send('Logged out successfully');
    });
  } else {
    res.send('Logged out successfully');
  }
});

module.exports = router;