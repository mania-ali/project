const express = require('express');
const router = express.Router();
const db = require('../db');

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    await db.poolConnect; // Wait for database connection
    console.log('Attempting login for:', email);
    
    // Check if user exists by email
    const result = await db.pool.request()
      .input('email', db.sql.VarChar, email)
      .query('SELECT user_id, name, email, password_hash FROM Users WHERE email = @email');
    
    const user = result.recordset[0];
    
    // If no user found with that email
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password - in your database, passwords seem to be stored as plaintext
    // In a real app, you would use bcrypt.compare()
    const passwordMatch = password === user.password_hash;
    
    if (!passwordMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Success - send back user info without password
    const { password_hash, ...userWithoutPassword } = user;
    console.log('Login successful for:', email);
    
    res.status(200).json({
      user: userWithoutPassword,
      token: 'dummy-token-' + user.user_id // In a real app, generate a JWT token
    });
    
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

module.exports = router;