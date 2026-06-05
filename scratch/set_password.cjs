const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: "postgres://postgres:1234@localhost:5433/scientific_journal_db?sslmode=disable"
});

async function main() {
  try {
    const hashedPassword = await bcrypt.hash("Password123!", 10);
    const result = await pool.query(
      `UPDATE "user" SET password = $1, status = 'ACTIVE' WHERE email = 'cubinvinh@gmail.com' RETURNING *`,
      [hashedPassword]
    );
    console.log("Update result:", result.rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
