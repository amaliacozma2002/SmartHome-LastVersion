const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  type:        { type: String, required: true },
  room:        { type: String, required: true },
  category:    { type: String, default: 'other' },
  isOn:        { type: Boolean, default: false },
  isFavorite:  { type: Boolean, default: false },
  status:      { type: String, default: 'offline' }, // 'online'/'offline'
  brightness:  { type: Number, min: 0, max: 100 },
  volume:      { type: Number, min: 0, max: 100 },
  temperature: { type: Number }, // pentru termostate
  battery:     { type: Number, min: 0, max: 100 },
  energyUsage: { type: Number, min: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Device', DeviceSchema);
