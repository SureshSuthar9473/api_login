

const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');
const config = require('../config/config');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
    } else {
      const isValidPassword = await user.isValidPassword(password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid password' });
      } else {
        const token = jwt.sign({ id: user._id }, config.secret);
        res.json({ token });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
