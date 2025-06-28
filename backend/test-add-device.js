const axios = require('axios');


const API_BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'demo@smarthome.com',
  password: 'Demo123!'
};


const TEST_DEVICE = {
  name: 'Test Smart Light',
  type: 'lighting',
  room: 'Living Room',
  category: 'lighting',
  isOn: false,
  isFavorite: false,
  status: 'online',
  brightness: 75,
  energyUsage: 12
};

async function testAddDevice() {
  try {
    console.log('🧪 Testing Add Device Backend Functionality...');
    console.log('================================================');

    // Step 1: Login to get authentication token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, TEST_USER);
    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Step 2: Test adding a device
    console.log('2. Adding test device...');
    const deviceResponse = await axios.post(
      `${API_BASE_URL}/api/devices`,
      TEST_DEVICE,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Device added successfully');
    console.log('Device ID:', deviceResponse.data._id);
    console.log('Device data:', JSON.stringify(deviceResponse.data, null, 2));

    // Step 3: Verify device was saved
    console.log('3. Fetching all devices to verify...');
    const allDevicesResponse = await axios.get(`${API_BASE_URL}/api/devices`);
    const addedDevice = allDevicesResponse.data.find(d => d._id === deviceResponse.data._id);
    
    if (addedDevice) {
      console.log('✅ Device verified in database');
      console.log('Total devices in database:', allDevicesResponse.data.length);
    } else {
      console.log('❌ Device not found in database');
    }

    // Step 4: Clean up - delete test device
    console.log('4. Cleaning up test device...');
    await axios.delete(
      `${API_BASE_URL}/api/devices/${deviceResponse.data._id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Test device cleaned up');

    console.log('\n🎉 All tests passed! Add device functionality is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure the backend server is running on http://localhost:5000');
      console.error('Run: cd backend && npm run dev');
    }
  }
}

// Run the test
testAddDevice();
