import pkg from 'pg';
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
    const res = await pool.query('SELECT user_id, email, role, status, type FROM "user" LIMIT 20');
    console.log("Database Users:");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("Database query failed:", err.message);
  } finally {
    await pool.end();
  }
}

run();
