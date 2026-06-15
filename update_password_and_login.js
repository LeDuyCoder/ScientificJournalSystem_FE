import pkg from 'pg';
import bcrypt from 'bcryptjs';
import axios from 'axios';
const { Pool } = pkg;

const connectionString = "postgresql://postgres.egyrzaqtmxmcezxchfrl:TeamSWP3912006@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    const testEmail = 'test_logout@example.com';
    const testPassword = 'password123';
    
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    // 2. Update DB
    await pool.query('UPDATE "user" SET password = $1, status = \'ACTIVE\' WHERE email = $2', [hashedPassword, testEmail]);
    console.log(`Updated password for ${testEmail} to ${testPassword}`);

    // 3. Test API login on port 8000
    console.log("Calling login API on port 8000...");
    const res = await axios.post(`http://localhost:8000/api/v1/auth/login`, {
      email: testEmail,
      password: testPassword
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("Login Successful! Response data:");
    console.log(JSON.stringify(res.data, null, 2));

  } catch (err) {
    if (err.response) {
      console.log(`[Fail] Status: ${err.response.status}`);
      console.log('Error data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Failed:", err.message);
    }
  } finally {
    await pool.end();
  }
}

run();
