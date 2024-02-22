const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt')
const login=require('../middleware/loginUser')

const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const jwt_key="nohihboiihohohihlknn"


// Secret key for JWT (replace this with a secure key
router.post('/SignUp', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  // Remove body('confirmPassword') validation

], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      // Remove confirmpassword from here
    });
  

    const token = jwt.sign({ userId: newUser._id }, jwt_key, { expiresIn: '24h' });
    res.status(201).json({ success: true, user: newUser, token });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Email is already registered' });
    } else {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
});


//signin
router.post('/SignIn', [
    body('email').trim().isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Compare the provided password with the stored hashed password
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        let success=false
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Create and sign a JWT token
      // console.log(user._id )

      const authToken = jwt.sign({ userId: user._id }, jwt_key, { expiresIn: '24h' });
      // Include the token in the response
      success=true
      res.status(200).json({success, authToken });
      console.log(authToken)
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

//getUser
router.get('/getUser', login, async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Use async/await to wait for the result
      const user = await User.findById(userId).select("name");
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send the user data
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
//getAllUsers

// getAllUsers
router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await User.find().select("name"); 
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;


