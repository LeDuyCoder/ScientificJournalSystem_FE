const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://postgres:1234@localhost:5433/scientific_journal_db?sslmode=disable"
});

async function main() {
  try {
    const result = await pool.query(
      `UPDATE "user" SET status = 'ACTIVE' WHERE email = 'testuser@gmail.com' RETURNING *`
    );
    console.log("Activation result:", result.rows);
  } catch (err) {
    console.error("Error activating user:", err);
  } finally {
    await pool.end();
  }
}

main();
