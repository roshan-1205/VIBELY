const fs = require('fs');
const path = require('path');

// Create a simple test image (SVG)
const testImageSVG = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0066cc"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">
    TEST IMAGE
  </text>
  <text x="50%" y="70%" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dy=".3em">
    If you see this, static serving works!
  </text>
</svg>`;

// Ensure directories exist
const uploadsDir = path.join(__dirname, 'backend', 'uploads');
const imagesDir = path.join(uploadsDir, 'images');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create test image
const testImagePath = path.join(imagesDir, 'test.svg');
fs.writeFileSync(testImagePath, testImageSVG);

console.log('✅ Test image created at:', testImagePath);
console.log('🌐 Test it at: http://localhost:5000/uploads/images/test.svg');
console.log('📄 Full test page: http://localhost:5000/test-image.html');
console.log('');
console.log('Next steps:');
console.log('1. Start the backend server: cd backend && npm run dev');
console.log('2. Visit the test URLs above');
console.log('3. If the test image loads, static serving works');
console.log('4. If not, there\'s an issue with the server configuration');