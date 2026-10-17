// Fechas siempre en hora de Argentina, sin importar la zona del dispositivo.
export const TZ_AR = 'America/Argentina/Buenos_Aires';

const isoFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ_AR,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

const hourFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ_AR,
  hour: '2-digit',
  hourCycle: 'h23'
});

// Fecha de hoy en Argentina como YYYY-MM-DD
export const todayAR = () => isoFormatter.format(new Date());

// Hora actual en Argentina (0-23)
export const hourAR = () => parseInt(hourFormatter.format(new Date()), 10);

// Suma (o resta) días a una fecha YYYY-MM-DD
export const addDays = (dateStr, days) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().split('T')[0];
};

// Día de la semana (0 = domingo) de una fecha YYYY-MM-DD
export const weekdayOf = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};
