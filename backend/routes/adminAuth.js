const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    await db.poolConnect;
    console.log('Admin login attempt for:', email);
    
    // Check if admin exists by email
    const result = await db.pool.request()
      .input('email', db.sql.VarChar, email)
      .query('SELECT admin_id, name, email, password_hash FROM Admins WHERE email = @email');
    
    const admin = result.recordset[0];
    
    if (!admin) {
      console.log('No admin found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password (in real app, use bcrypt)
    const passwordMatch = password === admin.password_hash;
    
    if (!passwordMatch) {
      console.log('Password mismatch for admin:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Success - send back admin info without password
    const { password_hash, ...adminWithoutPassword } = admin;
    console.log('Admin login successful for:', email);
    
    res.status(200).json({
      admin: adminWithoutPassword,
      token: 'admin-token-' + admin.admin_id,
      isAdmin: true
    });
    
  } catch (err) {
    console.error('Error during admin login:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

module.exports = router;