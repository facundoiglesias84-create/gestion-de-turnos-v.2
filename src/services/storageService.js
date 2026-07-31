// Servicio de almacenamiento local con estado inicial de ejemplo

const STORAGE_KEY = 'turnoflow_turnos_v1';
const CONFIG_KEY = 'turnoflow_xata_config';

// Fecha de hoy formateada YYYY-MM-DD
const getTodayFormatted = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const INITIAL_TURNOS = [
  {
    id: 't-101',
    clienteNombre: 'Carlos Gómez',
    clienteTelefono: '+54 9 11 4567-8901',
    clienteEmail: 'carlos.gomez@email.com',
    fecha: getTodayFormatted(),
    horaInicio: '09:00',
    horaFin: '10:00',
    servicio: 'Mantenimiento Preventivo',
    estado: 'confirmado', // 'confirmado' | 'pendiente' | 'completado' | 'cancelado'
    notas: 'Cliente solicita revisión de presión y escaneo computarizado.',
    tareas: [
      { id: 'tk-1', descripcion: 'Diagnóstico por computadora (ODB2)', completada: true },
      { id: 'tk-2', descripcion: 'Cambio de aceite de motor y filtro', completada: true },
      { id: 'tk-3', descripcion: 'Inspección de frenos y amortiguadores', completada: false }
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
    horaFin: '12:30',
    servicio: 'Consultoría Presencial',
    estado: 'confirmado',
    notas: 'Primera sesión de asesoramiento técnico.',
    tareas: [
      { id: 'tk-4', descripcion: 'Revisión de documentación previa', completada: true },
      { id: 'tk-5', descripcion: 'Definición de plan de acción', completada: false },
      { id: 'tk-6', descripcion: 'Entrega de informe inicial', completada: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 't-103',
    clienteNombre: 'Lucas Peralta',
    clienteTelefono: '+54 9 11 2233-4455',
    clienteEmail: 'l.peralta@email.com',
    fecha: getTodayFormatted(),
    horaInicio: '15:00',
    horaFin: '16:00',
    servicio: 'Servicio Express',
    estado: 'pendiente',
    notas: 'Pendiente de confirmación de pago de seña.',
    tareas: [
      { id: 'tk-7', descripcion: 'Verificación de componentes', completada: false },
      { id: 'tk-8', descripcion: 'Limpieza y empaquetado', completada: false }
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
    return JSON.parse(data);
  } catch (err) {
    console.error('Error cargando turnos de LocalStorage:', err);
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

export const getXataConfig = () => {
  try {
    const data = localStorage.getItem(CONFIG_KEY);
    return data ? JSON.parse(data) : { apiKey: '', dbUrl: '', branch: 'main', enabled: false };
  } catch (err) {
    return { apiKey: '', dbUrl: '', branch: 'main', enabled: false };
  }
};

export const saveXataConfig = (config) => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error guardando configuración Xata:', err);
  }
};
