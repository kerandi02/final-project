 const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

// Your API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
// ... other routes

// MongoDB Connection (clean, no deprecated options)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});