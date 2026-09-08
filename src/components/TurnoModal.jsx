import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, AlertTriangle } from 'lucide-react';

export const TurnoModal = ({ isOpen, onClose, onSave, defaultDate, turnosExistentes = [] }) => {
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [fecha, setFecha] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [servicio, setServicio] = useState('');
  const [precio, setPrecio] = useState('');
  const [notas, setNotas] = useState('');

  const [errorDuplicado, setErrorDuplicado] = useState('');

  useEffect(() => {
    if (defaultDate) {
      setFecha(defaultDate);
    }
  }, [defaultDate]);

  useEffect(() => {
    if (isOpen) {
      checkHorarioDuplicado(fecha, horaInicio);
    }
  }, [fecha, horaInicio, turnosExistentes, isOpen]);

  const checkHorarioDuplicado = (dateToCheck, timeToCheck) => {
    const existe = turnosExistentes.some((t) => t.fecha === dateToCheck && t.horaInicio === timeToCheck);

    if (existe) {
      setErrorDuplicado(`⚠️ Ya existe un turno agendado para la fecha ${dateToCheck} a las ${timeToCheck} hs.`);
    } else {
      setErrorDuplicado('');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorDuplicado) return;
    if (!servicio.trim()) return;

    const parsedPrecio = precio ? parseFloat(precio) : 0;

    const nuevoTurno = {
      id: 't-' + Date.now(),
      clienteNombre: clienteNombre.trim(),
      clienteTelefono: clienteTelefono.trim(),
      clienteEmail: '',
      fecha,
      horaInicio,
      horaFin: horaInicio,
      servicio: servicio.trim(),
      estado: 'nuevo',
      notas: notas.trim(),
      tareas: [{ id: 'tk-main', descripcion: servicio.trim(), precio: parsedPrecio, completada: false }],
      createdAt: new Date().toISOString()
    };

    onSave(nuevoTurno);

    // Resetear campos
    setClienteNombre('');
    setClienteTelefono('');
    setHoraInicio('09:00');
    setServicio('');
    setPrecio('');
    setNotas('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>
            Agendar Nuevo Turno
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        {errorDuplicado && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: '#fda4af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{errorDuplicado}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* CLIENTE Y TELÉFONO */}
          <div className="form-group">
            <label>Nombre y Apellido del Cliente *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: Juan Pérez"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Teléfono (Opcional)</label>
            <input 
              type="tel" 
              className="input-field" 
              placeholder="Ej: 1133529147"
              value={clienteTelefono}
              onChange={(e) => setClienteTelefono(e.target.value)}
            />
          </div>

          {/* FECHA Y HORA */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Fecha del Turno *</label>
              <input 
                type="date" 
                className="input-field" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Hora de Inicio *</label>
              <input 
                type="time" 
                className="input-field" 
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* TAREA / SERVICIO A REALIZAR */}
          <div className="form-group">
            <label>Tarea / Servicio a Realizar *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: Cambio de aceite, Corte y barba..."
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
            />
          </div>

          {/* PRECIO (OPCIONAL) */}
          <div className="form-group">
            <label>Monto a Cobrar ($) (Opcional)</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="Ej: 25000 (dejar en blanco si no aplica)"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          {/* NOTAS */}
          <div className="form-group">
            <label>Notas o Detalle Adicional (Opcional)</label>
            <textarea 
              className="textarea-field" 
              placeholder="Detalles sobre el turno..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              style={{ minHeight: '60px' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', width: '100%' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={!!errorDuplicado} style={{ flex: 1 }}>
              <Plus size={16} />
              <span>Agendar Turno</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
