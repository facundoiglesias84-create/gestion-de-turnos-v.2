const STORAGE_KEY = 'turnoflow_turnos_v1';
const PRESET_TASKS_KEY = 'turnoflow_preset_tasks_v2';
const INITIALIZED_KEY = 'turnoflow_preset_initialized_v2';

const getTodayFormatted = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_TAREAS_PREDEFINIDAS = [
  { id: 'tp-1', descripcion: 'Diagnóstico por computadora (ODB2)', precio: 5000 },
  { id: 'tp-2', descripcion: 'Cambio de aceite de motor y filtro', precio: 15000 },
  { id: 'tp-3', descripcion: 'Inspección de frenos y amortiguadores', precio: 8000 }
];

const INITIAL_TURNOS = [
  {
    id: 't-101',
    clienteNombre: 'Carlos Gómez',
    clienteTelefono: '+54 9 11 4567-8901',
    clienteEmail: 'carlos.gomez@email.com',
    fecha: getTodayFormatted(),
    horaInicio: '09:00',
    horaFin: '09:00',
    servicio: 'Turno de Servicio',
    estado: 'nuevo',
    notas: 'Cliente solicita revisión de presión y escaneo computarizado.',
    tareas: [
      { id: 'tk-1', descripcion: 'Diagnóstico por computadora (ODB2)', precio: 5000, completada: true },
      { id: 'tk-2', descripcion: 'Cambio de aceite de motor y filtro', precio: 15000, completada: true },
      { id: 'tk-3', descripcion: 'Inspección de frenos y amortiguadores', precio: 5000, completada: false }
    ],
    createdAt: new Date().toISOString()
  }
];

export const getStoredTurnos = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TURNOS));
      return INITIAL_TURNOS;
    }
    const parsed = JSON.parse(data);
    return parsed.map(t => {
      if (t.estado === 'pendiente') return { ...t, estado: 'nuevo' };
      if (t.estado === 'completado') return { ...t, estado: 'finalizado' };
      return t;
    });
  } catch (err) {
    return INITIAL_TURNOS;
  }
};

export const saveTurnos = (turnos) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turnos));
  } catch (err) {
    console.error('Error guardando turnos:', err);
  }
};

export const getStoredTareasPredefinidas = () => {
  try {
    const isInitialized = localStorage.getItem(INITIALIZED_KEY);
    if (!isInitialized) {
      localStorage.setItem(INITIALIZED_KEY, 'true');
      localStorage.setItem(PRESET_TASKS_KEY, JSON.stringify(DEFAULT_TAREAS_PREDEFINIDAS));
      return DEFAULT_TAREAS_PREDEFINIDAS;
    }

    const data = localStorage.getItem(PRESET_TASKS_KEY);
    if (data !== null) {
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    return [];
  }
};

export const saveTareasPredefinidas = (tareas) => {
  try {
    localStorage.setItem(INITIALIZED_KEY, 'true');
    localStorage.setItem(PRESET_TASKS_KEY, JSON.stringify(tareas));
  } catch (err) {
    console.error('Error guardando catálogo de tareas:', err);
  }
};
