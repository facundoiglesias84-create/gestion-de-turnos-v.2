import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Plus, AlertTriangle, User, Phone, Wrench, DollarSign, StickyNote } from 'lucide-react';
import { IconField } from './IconField';
import { todayAR } from '../utils/dateAR';

export const TurnoModal = ({ isOpen, onClose, onSave, defaultDate, turnosExistentes = [] }) => {
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [fecha, setFecha] = useState(defaultDate || todayAR());
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
      setErrorDuplicado(`Ya existe un turno agendado para la fecha ${dateToCheck} a las ${timeToCheck} hs.`);
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
          <div style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger-border)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', color: 'var(--danger-text)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{errorDuplicado}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* CLIENTE Y TELÉFONO */}
          <div className="form-group">
            <label>Nombre y Apellido del Cliente *</label>
            <IconField icon={User}>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                required
              />
            </IconField>
          </div>

          <div className="form-group">
            <label>Teléfono (Opcional)</label>
            <IconField icon={Phone}>
              <input
                type="tel"
                placeholder="Ej: 1133529147"
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
              />
            </IconField>
          </div>

          {/* FECHA Y HORA */}
          <div className="form-row-2">
            <div className="form-group">
              <label>Fecha del Turno *</label>
              <IconField icon={Calendar}>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </IconField>
            </div>

            <div className="form-group">
              <label>Hora de Inicio *</label>
              <IconField icon={Clock}>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                />
              </IconField>
            </div>
          </div>

          {/* TAREA / SERVICIO A REALIZAR */}
          <div className="form-group">
            <label>Tarea / Servicio a Realizar *</label>
            <IconField icon={Wrench}>
              <input
                type="text"
                placeholder="Ej: Cambio de aceite, Corte y barba..."
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                required
              />
            </IconField>
          </div>

          {/* PRECIO (OPCIONAL) */}
          <div className="form-group">
            <label>Monto a Cobrar ($) (Opcional)</label>
            <IconField icon={DollarSign}>
              <input
                type="number"
                placeholder="Ej: 25000"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </IconField>
          </div>

          {/* NOTAS */}
          <div className="form-group">
            <label>Notas o Detalle Adicional (Opcional)</label>
            <IconField icon={StickyNote} multiline>
              <textarea
                placeholder="Detalles sobre el turno..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
              ></textarea>
            </IconField>
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
