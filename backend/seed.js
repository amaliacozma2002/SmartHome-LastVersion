const Device = require('./models/Device');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedDevices = async () => {
  // SEED DEVICES
  const existingDevices = await Device.countDocuments();
  if (existingDevices === 0) {
    const devices = [
      { name: "Access Control", type: "access", room: "Living Room", isOn: true, isFavorite: true, status: "online" },
      { name: "Smart Thermostat", type: "thermostat", room: "Living Room", isOn: true, isFavorite: true, temperature: 22, status: "online" },
      { name: "Main Lights", type: "light", room: "Living Room", isOn: false, isFavorite: true, status: "online" },
      { name: "Bathroom Fan", type: "automation", room: "Bathroom", isOn: false, isFavorite: false, status: "offline" },
      // ... poți adăuga orice vrei
    ];
    await Device.insertMany(devices);
    console.log('🌱 Devices seeded');
  }

  // SEED USERS
  const existingUsers = await User.countDocuments();
  if (existingUsers === 0) {
    // Create demo user that matches frontend expectations
    const demoPasswordHash = await bcrypt.hash('Demo123!', 10);
    const demoUser = new User({
      username: 'demo',
      email: 'demo@smarthome.com',
      password: demoPasswordHash,
      role: 'user'
    });
    await demoUser.save();
    
    // Create the original seeded user as well
    const originalPasswordHash = await bcrypt.hash('parola123', 10);
    const originalUser = new User({
      username: 'amalia',
      email: 'amalia@email.com',
      password: originalPasswordHash,
      role: 'user'
    });
    await originalUser.save();
    
    console.log('🌱 User seeded');
  }
};

module.exports = seedDevices;
