import React, { useState } from 'react';
import { Bell, X, Clock, Calendar, Volume2, Check, Music } from 'lucide-react';
import { requestNotificationPermission } from '../utils/calendarHelper';

export const ReminderModal = ({ isOpen, onClose, turno }) => {
  if (!isOpen || !turno) return null;

  const defaultDate = turno.fecha;
  const [optionType, setOptionType] = useState('15min'); // '15min' | '30min' | '1hour' | '1day' | 'custom'
  const [customTime, setCustomTime] = useState(turno.horaInicio || '09:00');
  const [customDate, setCustomDate] = useState(defaultDate);
  const [ringtone, setRingtone] = useState('system'); // 'system' | 'chime' | 'alarm' | 'soft'
  const [isSaved, setIsSaved] = useState(false);

  // Reproducir vista previa de sonido usando Web Audio API
  const playSoundPreview = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'chime' || type === 'system') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else { // soft
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); // E5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      console.log('Audio Context no disponible');
    }
  };

  const handleSaveReminder = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      alert('Por favor autoriza los permisos de notificación en tu navegador/celular.');
      return;
    }

    let notifyDateObj;
    let labelText = '';

    if (optionType === 'custom') {
      const [y, m, d] = customDate.split('-').map(Number);
      const [h, min] = customTime.split(':').map(Number);
      notifyDateObj = new Date(y, m - 1, d, h, min);
      labelText = `para el ${customDate} a las ${customTime} hs`;
    } else {
      const [y, m, d] = turno.fecha.split('-').map(Number);
      const [h, min] = turno.horaInicio.split(':').map(Number);
      const turnoDate = new Date(y, m - 1, d, h, min);

      let offsetMs = 15 * 60 * 1000;
      if (optionType === '30min') offsetMs = 30 * 60 * 1000;
      if (optionType === '1hour') offsetMs = 60 * 60 * 1000;
      if (optionType === '1day') offsetMs = 24 * 60 * 60 * 1000;

      notifyDateObj = new Date(turnoDate.getTime() - offsetMs);
      labelText = `${optionType === '15min' ? '15 min' : optionType === '30min' ? '30 min' : optionType === '1hour' ? '1 hora' : '1 día'} antes del turno`;
    }

    const delay = notifyDateObj.getTime() - Date.now();

    // Confirmación en notificación de sistema inmediata
    new Notification(`🔔 Recordatorio Programado: ${turno.clienteNombre}`, {
      body: `Te avisaremos ${labelText} (${turno.servicio}). Tono: ${ringtone === 'system' ? 'Tono Nativo del Celular' : ringtone}`,
      icon: '/logo.jpg',
      vibrate: [200, 100, 200, 100, 400]
    });

    // Programar la alerta si está dentro de la sesión activa
    if (delay > 0) {
      setTimeout(() => {
        playSoundPreview(ringtone);
        new Notification(`⏰ ¡RECORDATORIO DE TURNO! ${turno.clienteNombre}`, {
          body: `Servicio: ${turno.servicio} a las ${turno.horaInicio} hs. Tel: ${turno.clienteTelefono || 'Sin registrar'}`,
          icon: '/logo.jpg',
          vibrate: [300, 100, 300, 100, 500]
        });
      }, delay);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-title">
            <Bell style={{ color: 'var(--accent-amber)' }} size={22} />
            <h2>Configurar Recordatorio</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Configura la hora exacta y el tono de notificación para el turno de <strong style={{ color: 'var(--text-primary)' }}>{turno.clienteNombre}</strong> ({turno.servicio} - {turno.horaInicio} hs).
        </div>

        {/* 1. SELECCIÓN DE HORA DE RECORDATORIO */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> ¿Cuándo quieres recibir la alerta?</label>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.35rem' }}>
            {[
              { id: '15min', label: '15 minutos antes' },
              { id: '30min', label: '30 minutos antes' },
              { id: '1hour', label: '1 hora antes' },
              { id: '1day', label: '1 día antes' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`btn ${optionType === opt.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setOptionType(opt.id)}
                style={{ fontSize: '0.775rem', padding: '0.45rem' }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`btn ${optionType === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setOptionType('custom')}
            style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.45rem' }}
          >
            <Calendar size={14} />
            <span>Definir Fecha y Hora Exacta</span>
          </button>

          {/* Selector Fecha & Hora Personalizada */}
          {optionType === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div>
                <label style={{ fontSize: '0.75rem' }}>Fecha del aviso</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={customDate} 
                  onChange={(e) => setCustomDate(e.target.value)} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem' }}>Hora del aviso</label>
                <input 
                  type="time" 
                  className="input-field" 
                  value={customTime} 
                  onChange={(e) => setCustomTime(e.target.value)} 
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. SELECCIÓN DE TONO / RING TONE */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label><Music size={14} style={{ display: 'inline', marginRight: '4px' }} /> Tono de Alarma / Notificación</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.35rem' }}>
            {[
              { id: 'system', label: '📱 Tono Nativo del Sistema del Celular', desc: 'Usa el sonido por defecto de tu Android / iPhone' },
              { id: 'chime', label: '🔔 Campana Cristal (Web Chime)', desc: 'Tono limpio y agudo' },
              { id: 'alarm', label: '⏰ Alarma Digital (Digital Tone)', desc: 'Tono rítmico de atención' },
              { id: 'soft', label: '🔊 Melodía Suave (Soft Tone)', desc: 'Tono armonioso relajante' }
            ].map((rt) => (
              <div 
                key={rt.id} 
                className="glass-panel" 
                onClick={() => {
                  setRingtone(rt.id);
                  playSoundPreview(rt.id);
                }}
                style={{ 
                  padding: '0.6rem 0.85rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderColor: ringtone === rt.id ? 'var(--accent-cyan)' : 'var(--border-color)',
                  background: ringtone === rt.id ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: ringtone === rt.id ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                    {rt.label}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{rt.desc}</div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-secondary btn-icon"
                  style={{ width: '32px', height: '32px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRingtone(rt.id);
                    playSoundPreview(rt.id);
                  }}
                  title="Escuchar Tono"
                >
                  <Volume2 size={15} style={{ color: 'var(--accent-cyan)' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BOTÓN DE GUARDADO */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          
          <button className="btn btn-primary" onClick={handleSaveReminder} disabled={isSaved}>
            {isSaved ? (
              <>
                <Check size={16} />
                <span>¡Recordatorio Activado!</span>
              </>
            ) : (
              <>
                <Bell size={16} />
                <span>Activar Recordatorio</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
