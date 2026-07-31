// Helper para integración con Calendario y Notificaciones del Sistema (Barra Superior WhatsApp style)

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
 * Muestra una notificación nativa en la BARRA SUPERIOR del sistema (Android / iOS / Windows) estilo WhatsApp
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
      icon: '/logo.jpg',
      badge: '/logo.jpg',
      vibrate: [300, 100, 300, 100, 400],
      tag: 'turno-sys-notif-' + Date.now(),
      renotify: true,
      requireInteraction: true,
      ...extraOptions
    };

    // Requerido para Android Chrome: Notificaciones vía ServiceWorker para salir en la barra superior
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options);
        return true;
      }
    }

    // Fallback estándar para navegadores de escritorio
    new Notification(title, options);
    return true;
  } catch (err) {
    console.error('Error disparando notificación:', err);
    try {
      new Notification(title, { body: bodyText, icon: '/logo.jpg' });
      return true;
    } catch (e) {
      return false;
    }
  }
};
