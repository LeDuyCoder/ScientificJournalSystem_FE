const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.egyrzaqtmxmcezxchfrl:TeamSWP3912006@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres"
});

async function run() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT * 
      FROM "user"
      LIMIT 1;
    `);
    console.log('--- SAMPLE USER ROW KEYS AND VALUES ---');
    if (res.rows.length > 0) {
      console.log(JSON.stringify(res.rows[0], null, 2));
    } else {
      console.log('No rows in user table');
    }
  } catch (err) {
    console.error('Error querying DB:', err.message);
  } finally {
    await client.end();
  }
}

run();
