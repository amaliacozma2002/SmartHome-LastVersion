const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Device = require('../models/Device');
const authenticateToken = require('../middleware/authMiddleware');

// Joi schema pentru device
const deviceSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  room: Joi.string().required(),
  category: Joi.string().optional(),
  isOn: Joi.boolean(),
  isFavorite: Joi.boolean(),
  status: Joi.string(),
  brightness: Joi.number().min(0).max(100).optional(),
  volume: Joi.number().min(0).max(100).optional(),
  temperature: Joi.number().optional(),
  battery: Joi.number().min(0).max(100).optional(),
  energyUsage: Joi.number().min(0).optional(),
});

// GET /api/devices — toate device-urile
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// CREATE device
router.post('/', authenticateToken, async (req, res) => {
  const { error } = deviceSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create device' });
  }
});

// TOGGLE ON/OFF device
router.post('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    device.isOn = !device.isOn;
    await device.save();
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle device' });
  }
});

// UPDATE device
router.put('/:id', authenticateToken, async (req, res) => {
  const { error } = deviceSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update device' });
  }
});

// DELETE device
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

module.exports = router;
