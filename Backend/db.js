
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const DB = process.env.MONGODB_URI;

mongoose.connect(DB)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });
