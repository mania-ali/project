const express = require('express');
const app = express();
const cors = require('cors'); // You'll need to install this: npm install cors
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); // New import for auth routes
const moviesRoutes = require('./routes/movies'); // We'll create this
const adminRoutes = require('./routes/admin'); // path to admin.js
const adminActionsRoutes = require('./routes/adminActions'); // path to admin.js
dotenv.config();

// Enable CORS for frontend requests and JSON parsing
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes); // Add auth routes
// We'll also need routes for movies
app.use('/api/movies', moviesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/adminActions', adminActionsRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));