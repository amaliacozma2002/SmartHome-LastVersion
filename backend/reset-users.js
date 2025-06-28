const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const resetUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

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
    
    console.log('🌱 Demo users created:');
    console.log('   📧 demo@smarthome.com / Demo123!');
    console.log('   📧 amalia@email.com / parola123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetUsers();
