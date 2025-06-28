
const fs = require('fs');
const path = require('path');

console.log('🔧 Smart Home Backend Health Check');
console.log('===================================');


const requiredFiles = [
  'index.js',
  'models/Device.js',
  'models/User.js',
  'routes/auth.js',
  'routes/devices.js',
  'routes/dashboard.js',
  'routes/protected.js',
  'middleware/authMiddleware.js',
  '.env',
  'package.json'
];

console.log('\n1. Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING!`);
    allFilesExist = false;
  }
});

// Check package.json dependencies
console.log('\n2. Checking package.json dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'joi', 'cors', 'dotenv'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - MISSING!`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  allFilesExist = false;
}

// Check .env file
console.log('\n3. Checking environment configuration...');
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} is configured`);
    } else {
      console.log(`❌ ${envVar} - MISSING!`);
    }
  });
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
}

// Check Device model structure
console.log('\n4. Checking Device model...');
try {
  const deviceModelContent = fs.readFileSync(path.join(__dirname, 'models/Device.js'), 'utf8');
  const requiredFields = ['name', 'type', 'room', 'category', 'brightness', 'volume', 'battery', 'energyUsage'];
  
  requiredFields.forEach(field => {
    if (deviceModelContent.includes(field)) {
      console.log(`✅ ${field} field present`);
    } else {
      console.log(`❌ ${field} field - MISSING!`);
    }
  });
} catch (error) {
  console.log('❌ Error reading Device model:', error.message);
}

// Final result
console.log('\n' + '='.repeat(40));
if (allFilesExist) {
  console.log('🎉 Backend health check PASSED!');
  console.log('\nTo test add device functionality:');
  console.log('1. Start the backend: npm run dev');
  console.log('2. In another terminal: npm run test-add-device');
} else {
  console.log('⚠️  Backend health check FAILED!');
  console.log('Some files or configurations are missing.');
  console.log('Please check the missing items above.');
}

console.log('\n💡 Quick Start Commands:');
console.log('   npm install          - Install dependencies');
console.log('   npm run dev          - Start development server');
console.log('   npm run test-add-device - Test add device functionality');
