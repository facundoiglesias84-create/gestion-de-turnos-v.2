import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.POSTGRES_URL;

const pool = new Pool({ connectionString });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT COUNT(*) FROM turnos');
    client.release();

    return res.status(200).json({
      connected: true,
      db: 'Neon (PostgreSQL)',
      count: parseInt(result.rows[0].count, 10)
    });
  } catch (err) {
    return res.status(200).json({
      connected: false,
      error: err.message
    });
  }
}
