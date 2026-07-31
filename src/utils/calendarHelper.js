// Helper para Integración con Calendarios y Recordatorios Programados

export const openCalendarEvent = (turno) => {
  const [year, month, day] = turno.fecha.split('-');
  const [hours, minutes] = (turno.horaInicio || '10:00').split(':');
  
  const startDateStr = `${year}${month}${day}T${hours}${minutes}00`;
  const endHours = String((parseInt(hours, 10) + 1) % 24).padStart(2, '0');
  const endDateStr = `${year}${month}${day}T${endHours}${minutes}00`;

  const title = encodeURIComponent(`Turno: ${turno.servicio} - ${turno.clienteNombre}`);
  const details = encodeURIComponent(`Cliente: ${turno.clienteNombre}\nTeléfono: ${turno.clienteTelefono || 'Sin registrar'}\nNotas: ${turno.notas || ''}`);

  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}`;
  
  window.open(googleCalUrl, '_blank');
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const scheduleTurnoReminder = (turno, minutosAntes = 15) => {
  if (!('Notification' in window)) {
    alert('Tu navegador no soporta notificaciones push.');
    return;
  }

  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      new Notification(`🔔 Recordatorio Programado: Turno de ${turno.clienteNombre}`, {
        body: `Recibirás una alerta ${minutosAntes} minutos antes de las ${turno.horaInicio} hs (${turno.servicio}).`,
        icon: '/logo.jpg'
      });

      // Calcular tiempo restante para el turno en milisegundos
      const [year, month, day] = turno.fecha.split('-').map(Number);
      const [hours, minutes] = turno.horaInicio.split(':').map(Number);
      
      const turnoDate = new Date(year, month - 1, day, hours, minutes);
      const reminderTime = new Date(turnoDate.getTime() - minutosAntes * 60 * 1000);
      const delay = reminderTime.getTime() - Date.now();

      if (delay > 0) {
        setTimeout(() => {
          new Notification(`⚠️ ¡EN 15 MINUTOS! Turno de ${turno.clienteNombre}`, {
            body: `Servicio: ${turno.servicio} a las ${turno.horaInicio} hs. Tel: ${turno.clienteTelefono || 'Sin teléfono'}`,
            icon: '/logo.jpg'
          });
        }, delay);
      }
    } else {
      alert('Debes permitir las notificaciones en la barra del navegador para recibir recordatorios.');
    }
  });
};
