import React, { useState, useEffect } from 'react';
import { X, Clock, Phone, CalendarClock, Edit3, Check } from 'lucide-react';
import { todayAR } from '../utils/dateAR';

export const TurnoDetailModal = ({ turno, isOpen, onClose, onUpdateTurno, onOpenReschedule }) => {
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [servicio, setServicio] = useState('');
  const [precio, setPrecio] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    if (turno) {
      setClienteNombre(turno.clienteNombre || '');
      setClienteTelefono(turno.clienteTelefono || '');
      setServicio(turno.servicio || '');
      
      const totalPrecio = turno.tareas && turno.tareas.length > 0 
        ? turno.tareas.reduce((acc, t) => acc + (t.precio || 0), 0)
        : 0;
      setPrecio(totalPrecio > 0 ? totalPrecio.toString() : '');
      setNotas(turno.notas || '');
    }
  }, [turno]);

  if (!isOpen || !turno) return null;

  const todayStr = todayAR();
  const isPast = turno.fecha < todayStr;
  const isToday = turno.fecha === todayStr;

  const handleSave = (e) => {
    e.preventDefault();
    const parsedPrecio = precio ? parseFloat(precio) : 0;

    const turnoActualizado = {
      ...turno,
      clienteNombre: clienteNombre.trim(),
      clienteTelefono: clienteTelefono.trim(),
      servicio: servicio.trim() || 'Turno de Servicio',
      notas: notas.trim(),
      tareas: [{ id: 'tk-main', descripcion: servicio.trim(), precio: parsedPrecio, completada: isPast }]
    };

    onUpdateTurno(turnoActualizado);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div>
            <span className={`badge ${isPast ? 'badge-completado' : isToday ? 'badge-confirmado' : 'badge-pendiente'}`} style={{ marginBottom: '0.4rem' }}>
              {isPast ? 'REALIZADO' : isToday ? 'HOY' : 'PRÓXIMO'}
            </span>
            <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>
              Editar Detalle del Turno
            </h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ background: 'var(--bg-soft)', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} /> Fecha y Hora
              </div>
              <strong style={{ fontSize: '0.85rem' }}>{turno.fecha} ({turno.horaInicio} hs)</strong>
            </div>

            <button 
              type="button"
              className="btn btn-secondary" 
              onClick={() => {
                onClose();
                if (onOpenReschedule) onOpenReschedule(turno);
              }}
              style={{ fontSize: '0.8rem', gap: '0.35rem', height: '100%', justifyContent: 'center' }}
            >
              <CalendarClock size={15} style={{ color: 'var(--primary)' }} />
              <span>Reagendar</span>
            </button>
          </div>

          <div className="form-group">
            <label>Cliente *</label>
            <input 
              type="text" 
              className="input-field"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              className="input-field"
              value={clienteTelefono}
              onChange={(e) => setClienteTelefono(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Tarea / Servicio a Realizar *</label>
            <input 
              type="text" 
              className="input-field"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Monto a Cobrar ($) (Opcional)</label>
            <input 
              type="number" 
              className="input-field"
              placeholder="Ej: 25000"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Notas</label>
            <textarea 
              className="textarea-field"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              style={{ minHeight: '60px' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', width: '100%' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
