const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://postgres:1234@localhost:5433/scientific_journal_db?sslmode=disable"
});

async function main() {
  try {
    const result = await pool.query('SELECT user_id, email, status FROM "user"');
    console.log("Users in DB:", result.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
