require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const authRoutes      = require('./routes/auth');
const deviceRoutes    = require('./routes/devices');
const dashboardRoutes = require('./routes/dashboard');
const protectedRoutes = require('./routes/protected');
const seedDevices     = require('./seed');

const app  = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/protected', protectedRoutes);

app.get('/', (req, res) => res.send('🚀 Smart Home Backend OK'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedDevices();
    app.listen(port, () => console.log(`🚀 Server listening on http://localhost:${port}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
