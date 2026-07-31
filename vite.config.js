import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pg from 'pg';
const { Pool } = pg;

const connectionString = 'postgresql://xata:N2T7kiclOpd72to3UzFCdY7J0HD1FHDn8tHw9tBelwHgCsBOdHYbXGuLrLSNhREw@lotafuq8s17fjckvferrcqtmk8.us-east-1.xata.tech/xata?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'xata-postgres-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Endpoint de estado de conexión Xata
          if (req.url === '/api/xata/status' && req.method === 'GET') {
            try {
              const client = await pool.connect();
              const result = await client.query('SELECT COUNT(*) FROM turnos');
              client.release();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ connected: true, db: 'Xata.io (PostgreSQL)', count: parseInt(result.rows[0].count, 10) }));
            } catch (err) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ connected: false, error: err.message }));
            }
            return;
          }

          // Endpoint para obtener todos los turnos directamente de Xata
          if (req.url === '/api/turnos' && req.method === 'GET') {
            try {
              const client = await pool.connect();
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

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(turnos));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          // Endpoint para guardar/actualizar un turno en Xata
          if (req.url === '/api/turnos' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const t = JSON.parse(body);
                const client = await pool.connect();
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
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, turno: t }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          // Endpoint para eliminar un turno de Xata
          if (req.url.startsWith('/api/turnos/') && req.method === 'DELETE') {
            const id = req.url.split('/api/turnos/')[1];
            try {
              const client = await pool.connect();
              await client.query('DELETE FROM turnos WHERE id = $1', [id]);
              client.release();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, id }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});
