const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';


router.post('/user/create', async (req, res) => {
  try {
    const { fullName, email, password, type } = req.body;

   
    if (!fullName || !email || !password || !type) {
      return res.status(400).send({ error: 'All fields are required' });
    }

    
    if (!['employee', 'admin'].includes(type)) {
      return res.status(400).send({ error: 'Invalid user type. Must be "employee" or "admin".' });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email is already in use' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({ fullName, email, password: hashedPassword, type });
    await newUser.save();

    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in /auth/user/create:', error.message); 
    res.status(500).send({ error: 'Error creating user' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, type: user.type }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ token, type: user.type });
  } catch (error) {
    console.error('Error in /auth/login:', error.message); 
    res.status(500).send({ error: 'Error logging in' });
  }
});


router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.send(users);
  } catch (error) {
    console.error('Error in /auth/users:', error.message); 
    res.status(500).send({ error: 'Error fetching users' });
  }
});

module.exports = router;