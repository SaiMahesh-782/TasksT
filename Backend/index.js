require('./db')
const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())

app.use('/api/auth', require('./Routes/auth'));
app.use('/api/Tasks', require('./Routes/Tasks'));

const port = process.env.PORT ;

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// const mongoose = require('mongoose');

// const DB = process.env.MONGODB_URI;

// mongoose.connect(DB)
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB Atlas:', error.message);
//   });
