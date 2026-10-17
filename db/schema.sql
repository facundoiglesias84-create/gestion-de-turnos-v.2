-- Esquema de la base (Neon / Postgres)
-- fecha y horas se guardan como texto (YYYY-MM-DD / HH:MM) porque la app las compara como strings.
CREATE TABLE IF NOT EXISTS turnos (
  id               TEXT PRIMARY KEY,
  cliente_nombre   TEXT NOT NULL DEFAULT '',
  cliente_telefono TEXT NOT NULL DEFAULT '',
  cliente_email    TEXT NOT NULL DEFAULT '',
  fecha            TEXT NOT NULL,
  hora_inicio      TEXT,
  hora_fin         TEXT,
  servicio         TEXT NOT NULL DEFAULT '',
  estado           TEXT NOT NULL DEFAULT 'nuevo',
  notas            TEXT NOT NULL DEFAULT '',
  tareas_json      TEXT NOT NULL DEFAULT '[]',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS turnos_fecha_hora_idx ON turnos (fecha, hora_inicio);
