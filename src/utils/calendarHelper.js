// Helper para exportar turnos al Calendario del Celular (Google Calendar, iCal / .ics) y Notificaciones Push

/**
 * Genera y descarga un archivo .ics para agendar directamente en el calendario del celular (iOS, Android, Outlook)
 */
export const downloadIcsFile = (turno) => {
  const [year, month, day] = turno.fecha.split('-');
  const [hours, minutes] = (turno.horaInicio || '10:00').split(':');

  const startDateStr = `${year}${month}${day}T${hours}${minutes}00`;
  
  // Calcular hora fin (+1 hora por defecto para la entrada de calendario)
  const endHours = String((parseInt(hours, 10) + 1) % 24).padStart(2, '0');
  const endDateStr = `${year}${month}${day}T${endHours}${minutes}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TurnoFlow//Gestion de Turnos//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:Turno: ${turno.servicio} - ${turno.clienteNombre}`,
    `DESCRIPTION:Cliente: ${turno.clienteNombre}\\nTel: ${turno.clienteTelefono || 'Sin registrar'}\\nNotas: ${turno.notas || ''}`,
    `DTSTART:${startDateStr}`,
    `DTEND:${endDateStr}`,
    `STATUS:${turno.estado.toUpperCase()}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M', // Recordatorio 30 min antes
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio de Turno',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `turno-${turno.clienteNombre.replace(/\s+/g, '_')}-${turno.fecha}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Genera el enlace directo para agregar a Google Calendar
 */
export const getGoogleCalendarUrl = (turno) => {
  const [year, month, day] = turno.fecha.split('-');
  const [hours, minutes] = (turno.horaInicio || '10:00').split(':');
  
  const startDateStr = `${year}${month}${day}T${hours}${minutes}00`;
  const endHours = String((parseInt(hours, 10) + 1) % 24).padStart(2, '0');
  const endDateStr = `${year}${month}${day}T${endHours}${minutes}00`;

  const title = encodeURIComponent(`Turno: ${turno.servicio} - ${turno.clienteNombre}`);
  const details = encodeURIComponent(`Cliente: ${turno.clienteNombre}\nTeléfono: ${turno.clienteTelefono || 'Sin registrar'}\nNotas: ${turno.notas || ''}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}`;
};

/**
 * Solicitar permiso para notificaciones Push en el navegador
 */
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

/**
 * Disparar una notificación de recordatorio
 */
export const sendTurnoReminderNotification = (turno) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Recordatorio de Turno: ${turno.clienteNombre}`, {
      body: `Servicio: ${turno.servicio} a las ${turno.horaInicio} hs el ${turno.fecha}`,
      icon: '/icon.svg'
    });
  }
};
