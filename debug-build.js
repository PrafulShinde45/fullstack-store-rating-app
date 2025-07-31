const fs = require('fs');
const path = require('path');

console.log('🔍 Debugging build process...');

// Check if frontend directory exists
const frontendPath = path.join(__dirname, 'frontend');
if (fs.existsSync(frontendPath)) {
  console.log('✅ Frontend directory exists');
} else {
  console.log('❌ Frontend directory not found');
  process.exit(1);
}

// Check if frontend/build directory exists
const buildPath = path.join(__dirname, 'frontend/build');
if (fs.existsSync(buildPath)) {
  console.log('✅ Frontend build directory exists');
  
  // List contents of build directory
  const buildContents = fs.readdirSync(buildPath);
  console.log('📁 Build contents:', buildContents);
  
  // Check for index.html
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html exists in build');
  } else {
    console.log('❌ index.html not found in build');
  }
} else {
  console.log('❌ Frontend build directory not found');
  console.log('💡 This means the frontend build process failed or was not run');
}

// Check environment variables
console.log('🌍 Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

console.log('🔍 Debug complete'); 