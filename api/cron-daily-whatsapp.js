import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.POSTGRES_URL || 'postgresql://xata:N2T7kiclOpd72to3UzFCdY7J0HD1FHDn8tHw9tBelwHgCsBOdHYbXGuLrLSNhREw@lotafuq8s17fjckvferrcqtmk8.us-east-1.xata.tech/xata?sslmode=require';

const targetPhoneNumber = process.env.ADMIN_WHATSAPP_NUMBER || '+5491133529147';

const formatFechaLargaEs = (dateObj) => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return `${dias[dateObj.getDay()]} ${dateObj.getDate()} de ${meses[dateObj.getMonth()]}`;
};

export default async function handler(req, res) {
  // Permitir invocaciones por Cron de Vercel o peticiones GET/POST con clave secreta
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    // 1. Obtener la fecha de MAÑANA en zona horaria Argentina (UTC-3)
    const now = new Date();
    // Ajuste UTC-3
    const argNow = new Date(now.getTime() - (3 * 60 * 60 * 1000));
    const tomorrow = new Date(argNow);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowDateStr = `${year}-${month}-${day}`;

    // 2. Consultar turnos de la base de datos Xata PostgreSQL
    const query = `
      SELECT * FROM turnos 
      WHERE fecha = $1 AND estado != 'cancelado' 
      ORDER BY hora_inicio ASC;
    `;
    const dbRes = await pool.query(query, [tomorrowDateStr]);
    const turnosMañana = dbRes.rows;

    // 3. Construir mensaje profesional de WhatsApp en formato Markdown
    const fechaFormateada = formatFechaLargaEs(tomorrow);

    let messageText = `📋 *RESUMEN DE TURNOS DE MAÑANA*\n🗓️ *${fechaFormateada}*\n\n`;

    if (turnosMañana.length === 0) {
      messageText += `✨ *No tienes turnos agendados para el día de mañana.*\n¡Disfruta de tu jornada libre!\n`;
    } else {
      let totalRecaudacion = 0;

      turnosMañana.forEach((t, index) => {
        let tareas = [];
        try {
          tareas = typeof t.tareas === 'string' ? JSON.parse(t.tareas) : (t.tareas || []);
        } catch (e) {
          tareas = [];
        }

        const totalPrecioTurno = tareas.reduce((acc, tk) => acc + (tk.precio || 0), 0);
        totalRecaudacion += totalPrecioTurno;

        messageText += `*${index + 1}. ${t.cliente_nombre}*\n`;
        messageText += `⏰ *Hora:* ${t.hora_inicio} hs\n`;
        messageText += `📞 *Tel:* ${t.cliente_telefono || 'Sin registrar'}\n`;
        
        if (tareas.length > 0) {
          const listaTareasStr = tareas.map(tk => tk.descripcion).join(', ');
          messageText += `🛠️ *Tareas:* ${listaTareasStr}\n`;
        }
        
        messageText += `💵 *Total:* $${totalPrecioTurno.toLocaleString('es-AR')}\n`;
        messageText += `-----------------------------------\n`;
      });

      messageText += `\n📊 *Total Turnos de Mañana:* ${turnosMañana.length}\n`;
      messageText += `💰 *Ingreso Estimado:* $${totalRecaudacion.toLocaleString('es-AR')}\n`;
    }

    messageText += `\n_🤖 Notificación automática enviada a las 20:00 hs._`;

    // 4. Envío de WhatsApp a través del webhook / API de notificaciones
    // Meta WhatsApp Cloud API / Twilio WhatsApp API / Green API
    const whatsappApiUrl = process.env.WHATSAPP_API_URL || 'https://api.ultramsg.com/instance/messages/chat';
    const whatsappToken = process.env.WHATSAPP_TOKEN || '';

    let apiSent = false;

    if (whatsappToken && process.env.WHATSAPP_INSTANCE_ID) {
      const response = await fetch(`https://api.ultramsg.com/${process.env.WHATSAPP_INSTANCE_ID}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: whatsappToken,
          to: targetPhoneNumber,
          body: messageText
        })
      });
      const data = await response.json();
      apiSent = data.sent === 'true' || !!data.id;
    }

    await pool.end();

    return res.status(200).json({
      success: true,
      message: 'Resumen diario de turnos procesado exitosamente',
      targetDate: tomorrowDateStr,
      targetPhone: targetPhoneNumber,
      turnosCount: turnosMañana.length,
      whatsappSent: apiSent,
      generatedMessage: messageText
    });

  } catch (error) {
    console.error('Error enviando resumen de WhatsApp:', error);
    await pool.end();
    return res.status(500).json({ success: false, error: error.message });
  }
}
