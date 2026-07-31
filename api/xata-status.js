import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.POSTGRES_URL || 'postgresql://xata:N2T7kiclOpd72to3UzFCdY7J0HD1FHDn8tHw9tBelwHgCsBOdHYbXGuLrLSNhREw@lotafuq8s17fjckvferrcqtmk8.us-east-1.xata.tech/xata?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT COUNT(*) FROM turnos');
    client.release();

    return res.status(200).json({
      connected: true,
      db: 'Xata.io (PostgreSQL)',
      count: parseInt(result.rows[0].count, 10)
    });
  } catch (err) {
    return res.status(200).json({
      connected: false,
      error: err.message
    });
  }
}
