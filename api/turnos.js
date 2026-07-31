import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.POSTGRES_URL || 'postgresql://xata:N2T7kiclOpd72to3UzFCdY7J0HD1FHDn8tHw9tBelwHgCsBOdHYbXGuLrLSNhREw@lotafuq8s17fjckvferrcqtmk8.us-east-1.xata.tech/xata?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await pool.connect();

    // GET /api/turnos
    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM turnos ORDER BY fecha ASC, hora_inicio ASC');
      client.release();

      const turnos = result.rows.map(r => ({
        id: r.id,
        clienteNombre: r.cliente_nombre,
        clienteTelefono: r.cliente_telefono,
        clienteEmail: r.cliente_email,
        fecha: r.fecha,
        horaInicio: r.hora_inicio,
        horaFin: r.hora_fin,
        servicio: r.servicio,
        estado: r.estado,
        notas: r.notas,
        tareas: r.tareas_json ? JSON.parse(r.tareas_json) : [],
        createdAt: r.created_at
      }));

      return res.status(200).json(turnos);
    }

    // POST /api/turnos
    if (req.method === 'POST') {
      const t = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await client.query(`
        INSERT INTO turnos (id, cliente_nombre, cliente_telefono, cliente_email, fecha, hora_inicio, hora_fin, servicio, estado, notas, tareas_json)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          cliente_nombre = EXCLUDED.cliente_nombre,
          cliente_telefono = EXCLUDED.cliente_telefono,
          cliente_email = EXCLUDED.cliente_email,
          fecha = EXCLUDED.fecha,
          hora_inicio = EXCLUDED.hora_inicio,
          hora_fin = EXCLUDED.hora_fin,
          servicio = EXCLUDED.servicio,
          estado = EXCLUDED.estado,
          notas = EXCLUDED.notas,
          tareas_json = EXCLUDED.tareas_json;
      `, [
        t.id, t.clienteNombre, t.clienteTelefono || '', t.clienteEmail || '',
        t.fecha, t.horaInicio, t.horaFin, t.servicio, t.estado,
        t.notas || '', JSON.stringify(t.tareas || [])
      ]);
      client.release();

      return res.status(200).json({ success: true, turno: t });
    }

    // DELETE /api/turnos?id=xyz o /api/turnos/[id]
    if (req.method === 'DELETE') {
      const id = req.query.id || req.url.split('/api/turnos/')[1];
      if (id) {
        await client.query('DELETE FROM turnos WHERE id = $1', [id]);
      }
      client.release();
      return res.status(200).json({ success: true, id });
    }

    client.release();
    res.status(405).json({ error: 'Método no permitido' });

  } catch (err) {
    console.error('Error en Vercel Serverless Function turnos:', err);
    return res.status(500).json({ error: err.message });
  }
}
