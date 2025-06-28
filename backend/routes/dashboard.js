const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const authenticateToken = require('../middleware/authMiddleware');


const user = {
  name: "Amalia",
  plan: "Premium",
  activeDevices: 12,
  rooms: 5
};
const categories = [
  { id: "heating", name: "Heating & Cooling", icon: "thermometer", deviceCount: 3 },
  { id: "lighting", name: "Lighting", icon: "lightbulb", deviceCount: 8 },
  { id: "shading", name: "Shading", icon: "shading", deviceCount: 4 },
  { id: "security", name: "Security", icon: "security", deviceCount: 2 },
  { id: "multimedia", name: "Multimedia", icon: "multimedia", deviceCount: 5 },
  { id: "music", name: "Music", icon: "music", deviceCount: 3 }
];
const subscription = {
  current: { plan: "Premium", used: 13, limit: 25, price: "$9.99/month" },
  plans: [
    { name: "Free", limit: 5, features: ["Basic automation", "Mobile app access", "Email support"], price: "$0/month", isCurrent: false },
    { name: "Premium", limit: 25, features: ["Advanced automation", "Voice control", "Priority support", "Cloud storage", "Energy monitoring"], price: "$9.99/month", isCurrent: true },
    { name: "Pro", limit: 100, features: ["Unlimited devices", "Professional automation", "Multi-home support", "24/7 phone support", "Advanced analytics", "Custom integrations", "White-label options"], price: "$19.99/month", isCurrent: false }
  ]
};
const scenes = [
  { id: "morning", name: "Good Morning", description: "Turn on lights, start coffee maker, set comfortable temperature" },
  { id: "movie", name: "Movie Night", description: "Dim lights, turn on TV and sound system" },
  { id: "bedtime", name: "Bedtime", description: "Turn off all lights, lock doors, set night temperature" },
  { id: "away", name: "Away Mode", description: "Turn off non-essential devices, activate security" }
];

// GET /api/dashboard 
router.get('/', /*authenticateToken,*/ async (req, res) => {
  try {
    const devices = await Device.find();
    res.json({
      user,
      categories,
      devices,
      subscription,
      scenes
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

module.exports = router;
