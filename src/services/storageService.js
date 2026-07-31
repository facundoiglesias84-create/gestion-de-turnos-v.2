const STORAGE_KEY = 'turnoflow_turnos_v1';
const SERVICES_KEY = 'turnoflow_servicios_v1';
const CONFIG_KEY = 'turnoflow_xata_config';

const getTodayFormatted = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_SERVICIOS = [
  { id: 's-1', nombre: 'Mantenimiento Preventivo', descripcion: 'Revisión técnica periódica', precioBase: 25000 },
  { id: 's-2', nombre: 'Consultoría Presencial', descripcion: 'Asesoramiento y diagnóstico', precioBase: 18000 },
  { id: 's-3', nombre: 'Servicio Express', descripcion: 'Atención rápida en el día', precioBase: 15000 },
  { id: 's-4', nombre: 'Diagnóstico General', descripcion: 'Escaneo computarizado', precioBase: 12000 },
  { id: 's-5', nombre: 'Atención Médica / Clínica', descripcion: 'Consulta profesional', precioBase: 30000 },
  { id: 's-6', nombre: 'Corte y Estética', descripcion: 'Servicio de estética', precioBase: 10000 }
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
    servicio: 'Mantenimiento Preventivo',
    estado: 'nuevo', // 'nuevo' | 'confirmado' | 'finalizado'
    notas: 'Cliente solicita revisión de presión y escaneo computarizado.',
    tareas: [
      { id: 'tk-1', descripcion: 'Diagnóstico por computadora (ODB2)', precio: 5000, completada: true },
      { id: 'tk-2', descripcion: 'Cambio de aceite de motor y filtro', precio: 15000, completada: true },
      { id: 'tk-3', descripcion: 'Inspección de frenos y amortiguadores', precio: 5000, completada: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 't-102',
    clienteNombre: 'María Rodríguez',
    clienteTelefono: '+54 9 11 9876-5432',
    clienteEmail: 'maria.rodriguez@email.com',
    fecha: getTodayFormatted(),
    horaInicio: '11:30',
    horaFin: '11:30',
    servicio: 'Consultoría Presencial',
    estado: 'confirmado',
    notas: 'Primera sesión de asesoramiento técnico.',
    tareas: [
      { id: 'tk-4', descripcion: 'Revisión de documentación previa', precio: 8000, completada: true },
      { id: 'tk-5', descripcion: 'Definición de plan de acción', precio: 10000, completada: false }
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
    // Mapear estados viejos si existen
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

export const getStoredServicios = () => {
  try {
    const data = localStorage.getItem(SERVICES_KEY);
    if (!data) {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(DEFAULT_SERVICIOS));
      return DEFAULT_SERVICIOS;
    }
    return JSON.parse(data);
  } catch (err) {
    return DEFAULT_SERVICIOS;
  }
};

export const saveServicios = (servicios) => {
  try {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(servicios));
  } catch (err) {
    console.error('Error guardando servicios:', err);
  }
};
