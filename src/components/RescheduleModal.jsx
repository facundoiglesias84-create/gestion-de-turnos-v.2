import React, { useState, useEffect } from 'react';
import { CalendarClock, X, Calendar, Clock, AlertTriangle, Check } from 'lucide-react';

export const RescheduleModal = ({ isOpen, onClose, turno, turnosExistentes = [], onReschedule }) => {
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');
  const [errorDuplicado, setErrorDuplicado] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (turno) {
      setNuevaFecha(turno.fecha || '');
      setNuevaHora(turno.horaInicio || '09:00');
    }
  }, [turno, isOpen]);

  useEffect(() => {
    if (isOpen && turno && nuevaFecha && nuevaHora) {
      checkHorarioDuplicado(nuevaFecha, nuevaHora);
    }
  }, [nuevaFecha, nuevaHora, turno, turnosExistentes, isOpen]);

  const checkHorarioDuplicado = (dateToCheck, timeToCheck) => {
    // Si la fecha y hora no cambiaron respecto al turno actual, no es duplicado de sí mismo
    if (dateToCheck === turno.fecha && timeToCheck === turno.horaInicio) {
      setErrorDuplicado('');
      return;
    }

    const existe = turnosExistentes.some((t) => {
      if (t.id === turno.id) return false;
      if (t.estado === 'cancelado' || t.estado === 'finalizado') return false;
      return t.fecha === dateToCheck && t.horaInicio === timeToCheck;
    });

    if (existe) {
      setErrorDuplicado(`⚠️ Ya existe un turno agendado para la fecha ${dateToCheck} a las ${timeToCheck} hs.`);
    } else {
      setErrorDuplicado('');
    }
  };

  if (!isOpen || !turno) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorDuplicado) return;

    onReschedule({
      ...turno,
      fecha: nuevaFecha,
      horaInicio: nuevaHora,
      horaFin: nuevaHora
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ fontSize: '1.15rem' }}>
            <CalendarClock size={22} style={{ color: 'var(--accent-cyan)' }} />
            <span>Reagendar Turno</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Cliente</div>
          <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{turno.clienteNombre}</strong>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
            Actualmente agendado para: <strong>{turno.fecha} ({turno.horaInicio} hs)</strong>
          </div>
        </div>

        {errorDuplicado && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: '#fda4af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{errorDuplicado}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> Nueva Fecha *</label>
            <input 
              type="date" 
              className="input-field" 
              value={nuevaFecha} 
              onChange={(e) => setNuevaFecha(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Nueva Hora *</label>
            <input 
              type="time" 
              className="input-field" 
              value={nuevaHora} 
              onChange={(e) => setNuevaHora(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            
            <button type="submit" className="btn btn-primary" disabled={!!errorDuplicado || isSaved}>
              {isSaved ? (
                <>
                  <Check size={16} />
                  <span>¡Reagendado!</span>
                </>
              ) : (
                <>
                  <CalendarClock size={16} />
                  <span>Guardar Nuevo Horario</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
