const express = require('express');
const router = express.Router();
const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware');

// Joi schema for user register
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Registration
router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, name, email, password } = req.body;
  
  // Use provided username or generate from name/email
  const finalUsername = username || name || email.split('@')[0];
  
  const exists = await User.findOne({ $or: [{ username: finalUsername }, { email }] });
  if (exists) return res.status(409).json({ error: 'User or email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ 
    username: finalUsername, 
    email, 
    password: hashed 
  });
  
  await user.save();
  
  // Return user with token for auto-login after registration
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  res.status(201).json({ 
    message: 'User created successfully',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.username
    }
  });
});

// Login - accepts both email and username
router.post('/login', async (req, res) => {
  const { email, username, password } = req.body;
  
  // Allow login with either email or username
  const loginField = email || username;
  if (!loginField || !password) {
    return res.status(400).json({ error: 'Email/username and password are required' });
  }
  
  const user = await User.findOne({ 
    $or: [{ email: loginField }, { username: loginField }] 
  });
  
  if (!user) return res.status(401).json({ error: 'User not found' });
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  res.json({
    token,
    user: { 
      id: user._id,
      username: user.username, 
      email: user.email,
      name: user.username 
    }
  });
});

// Schimbare parolă (autentificare necesară)
router.post('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) return res.status(401).json({ error: 'Incorrect old password' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed successfully' });
});

// Resetare parolă (demo - fără email)
router.post('/reset-password', async (req, res) => {
  const { username, email, newPassword } = req.body;
  const user = await User.findOne({ username, email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password reset successfully' });
});

// Ștergere cont (autentificare necesară)
router.delete('/delete-account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete the user account
    await User.findByIdAndDelete(req.user.userId);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;
