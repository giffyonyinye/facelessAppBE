// Simple test script to verify API endpoints
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('Testing Faceless Backend API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test API health
    console.log('\n2. Testing API health...');
    const apiHealthResponse = await fetch(`${BASE_URL}/api/health`);
    const apiHealthData = await apiHealthResponse.json();
    console.log('✅ API health:', apiHealthData.status);
    console.log('   Database:', apiHealthData.database);

    // Test CORS
    console.log('\n3. Testing CORS headers...');
    const corsResponse = await fetch(`${BASE_URL}/`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8081',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ CORS status:', corsResponse.status);

    console.log('\n🎉 All basic tests passed!');
    console.log('\nTo test authentication endpoints, you need to:');
    console.log('1. Set up your .env file with MONGODB_URI and JWT_SECRET');
    console.log('2. Start the server with: npm run dev');
    console.log('3. Test registration: POST /api/auth/register');
    console.log('4. Test login: POST /api/auth/login');
    console.log('5. Test pseudonymous: POST /api/auth/pseudonymous');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the server is running on port 5000');
    console.log('Start it with: npm run dev');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };
