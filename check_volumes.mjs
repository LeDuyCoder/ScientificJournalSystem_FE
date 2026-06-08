import dotenv from 'dotenv';
dotenv.config({ path: 'e:/Scientific_Journal_Publication_Trend_Tracking_System/ScientificJournalSystem_BE_NodeJS/.env' });

import pool from 'e:/Scientific_Journal_Publication_Trend_Tracking_System/ScientificJournalSystem_BE_NodeJS/src/config/database.js';

async function main() {
  try {
    // Check volumes for journal 643
    const volRes = await pool.query(
      `SELECT volume_id::text, journal_id::text, volume_number, publication_year, is_deleted
       FROM "Volume"
       WHERE journal_id = $1
       ORDER BY publication_year DESC NULLS LAST
       LIMIT 20`,
      [643]
    );
    console.log('=== Volumes for journal_id=643 ===');
    console.log(JSON.stringify(volRes.rows, null, 2));
    console.log(`Total: ${volRes.rows.length}`);

    // Also check total volume count
    const totalRes = await pool.query(`SELECT COUNT(*)::integer AS total FROM "Volume"`);
    console.log(`\n=== Total volumes in DB: ${totalRes.rows[0].total} ===`);

    // Sample 5 volumes to see what journal_ids exist
    const sampleRes = await pool.query(
      `SELECT DISTINCT journal_id::text, COUNT(*)::integer AS vol_count
       FROM "Volume"
       GROUP BY journal_id
       ORDER BY vol_count DESC
       LIMIT 10`
    );
    console.log('\n=== Top 10 journals by volume count ===');
    console.log(JSON.stringify(sampleRes.rows, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

main();
