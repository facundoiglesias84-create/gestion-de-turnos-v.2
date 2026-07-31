// Helper para integración con Calendario y Notificaciones del Sistema

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
  if (!('Notification' in window)) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (e) {
    return false;
  }
};

/**
 * Muestra una notificación nativa en la BARRA SUPERIOR del sistema con ícono de Reloj monocromático (badge.svg)
 */
export const showSystemNotification = async (title, bodyText, extraOptions = {}) => {
  try {
    if (!('Notification' in window)) return false;

    let permission = Notification.permission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
    }

    if (permission !== 'granted') {
      alert('Debes otorgar permiso de notificaciones en la barra de direcciones o ajustes del navegador.');
      return false;
    }

    const options = {
      body: bodyText,
      icon: '/icon.svg',
      badge: '/badge.svg', // Icono monocromático transparente para la barra superior de Android sin cuadro blanco
      vibrate: [300, 100, 300, 100, 400],
      tag: 'turno-sys-notif-' + Date.now(),
      renotify: true,
      requireInteraction: true,
      ...extraOptions
    };

    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options);
        return true;
      }
    }

    new Notification(title, options);
    return true;
  } catch (err) {
    console.error('Error disparando notificación:', err);
    try {
      new Notification(title, { body: bodyText, icon: '/icon.svg', badge: '/badge.svg' });
      return true;
    } catch (e) {
      return false;
    }
  }
};

/**
 * Programar notificación en segundo plano vía ServiceWorker para que suene incluso con la app cerrada
 */
export const scheduleBackgroundNotification = (title, body, delayMs) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SCHEDULE_REMINDER',
      title,
      body,
      delayMs
    });
  }
};
