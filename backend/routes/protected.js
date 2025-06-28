const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

// Rute demo protejate
router.get('/', authenticateToken, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

module.exports = router;
