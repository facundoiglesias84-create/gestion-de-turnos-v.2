// Servicio de API de Xata.io conectado directamente al servidor Postgres

export const fetchTurnosFromXata = async () => {
  try {
    const res = await fetch('/api/turnos');
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    return { success: false, error: 'Error al consultar /api/turnos' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const syncTurnoToXata = async (turno) => {
  try {
    const res = await fetch('/api/turnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(turno)
    });
    if (res.ok) {
      return { synced: true };
    }
    return { synced: false };
  } catch (err) {
    console.error('Error enviando turno a Xata API:', err);
    return { synced: false, error: err.message };
  }
};

export const deleteTurnoFromXata = async (id) => {
  try {
    const res = await fetch(`/api/turnos/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (err) {
    return false;
  }
};

export const checkXataStatus = async () => {
  try {
    const res = await fetch('/api/xata/status');
    if (res.ok) {
      return await res.json();
    }
    return { connected: false };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};
