
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const DB = "mongodb+srv://SAI:hIpCuKLQIBzwzAmr@cluster0.hwhe9q5.mongodb.net/Tasks";

mongoose.connect(DB)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });
