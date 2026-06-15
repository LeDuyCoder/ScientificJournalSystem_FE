import axios from 'axios';

async function testPort(port) {
  console.log(`--- Testing port ${port} ---`);
  try {
    const res = await axios.post(`http://localhost:${port}/api/v1/auth/login`, {
      email: 'e.smith@university-press.edu',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`[Success] Status: ${res.status}`);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.log(`[Fail] Status: ${err.response.status}`);
      console.log('Error data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('[Fail] Network Error:', err.message);
    }
  }
}

async function run() {
  await testPort(8000);
  await testPort(5050);
}

run();
