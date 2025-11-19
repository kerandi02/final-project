 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Your API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reportRoutes'));
// ... other routes

// MongoDB Connection (clean, no deprecated options)
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUri) {
  console.error('Error: MongoDB connection string not found. Set `MONGODB_URI` in environment.');
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});