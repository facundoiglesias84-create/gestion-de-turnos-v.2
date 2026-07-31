import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Plus, Trash2, CheckSquare, Sparkles, AlertTriangle } from 'lucide-react';

const SERVICIOS_SUGERIDOS = [
  'Mantenimiento Preventivo',
  'Consultoría Presencial',
  'Servicio Express',
  'Diagnóstico General',
  'Atención Médica / Clínica',
  'Corte y Estética'
];

export const TurnoModal = ({ isOpen, onClose, onSave, defaultDate, turnosExistentes = [] }) => {
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [fecha, setFecha] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('10:00');
  const [servicio, setServicio] = useState(SERVICIOS_SUGERIDOS[0]);
  const [estado, setEstado] = useState('confirmado');
  const [notas, setNotas] = useState('');
  
  const [conflictError, setConflictError] = useState('');

  const [tareas, setTareas] = useState([
    { id: 't1', descripcion: 'Revisión inicial del requerimiento', completada: false },
    { id: 't2', descripcion: 'Ejecución del servicio contratado', completada: false }
  ]);
  const [nuevaTareaText, setNuevaTareaText] = useState('');

  useEffect(() => {
    if (defaultDate) {
      setFecha(defaultDate);
    }
    setConflictError('');
  }, [defaultDate, isOpen]);

  // Verificar solapamiento de horario al cambiar fecha o horaInicio
  useEffect(() => {
    if (fecha && horaInicio) {
      const existeConflicto = turnosExistentes.some((t) => 
        t.fecha === fecha && 
        t.horaInicio === horaInicio && 
        t.estado !== 'cancelado'
      );

      if (existeConflicto) {
        setConflictError(`⚠️ Ya existe un turno agendado para la fecha ${fecha} a las ${horaInicio} hs. Por favor selecciona otro horario.`);
      } else {
        setConflictError('');
      }
    }
  }, [fecha, horaInicio, turnosExistentes]);

  if (!isOpen) return null;

  const handleAgregarTarea = (e) => {
    e.preventDefault();
    if (!nuevaTareaText.trim()) return;
    const newTask = {
      id: 'tk-' + Date.now(),
      descripcion: nuevaTareaText.trim(),
      completada: false
    };
    setTareas([...tareas, newTask]);
    setNuevaTareaText('');
  };

  const handleEliminarTarea = (id) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clienteNombre.trim()) {
      alert('Por favor ingrese el nombre del cliente.');
      return;
    }

    if (conflictError) {
      return;
    }

    const nuevoTurno = {
      id: 't-' + Date.now(),
      clienteNombre: clienteNombre.trim(),
      clienteTelefono: clienteTelefono.trim(),
      clienteEmail: clienteEmail.trim(),
      fecha,
      horaInicio,
      horaFin: horaInicio, // Se mantiene horaInicio como valor unico
      servicio,
      estado,
      notas: notas.trim(),
      tareas,
      createdAt: new Date().toISOString()
    };

    onSave(nuevoTurno);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Calendar style={{ color: 'var(--accent-cyan)' }} size={22} />
            <h2>Agendar Nuevo Turno</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Alerta de Conflicto de Horario */}
          {conflictError && (
            <div 
              style={{ 
                padding: '0.75rem 0.85rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'rgba(244, 63, 94, 0.15)', 
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{conflictError}</span>
            </div>
          )}

          {/* Datos del Cliente */}
          <div className="form-group">
            <label><User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Nombre del Cliente *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: Laura Martínez"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} /> Teléfono / WhatsApp</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="+54 9 11 ..."
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Correo Electrónico</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="cliente@email.com"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Solo Fecha y Hora de Inicio */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Fecha del Turno</label>
              <input 
                type="date" 
                className="input-field" 
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label><Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Hora del Turno</label>
              <input 
                type="time" 
                className="input-field" 
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Servicio y Estado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Servicio / Categoría</label>
              <select className="select-field" value={servicio} onChange={(e) => setServicio(e.target.value)}>
                {SERVICIOS_SUGERIDOS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Estado del Turno</label>
              <select className="select-field" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="confirmado">Confirmado</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* TAREAS A REALIZAR */}
          <div className="tasks-section">
            <div className="tasks-header">
              <div className="tasks-title">
                <CheckSquare size={16} />
                <span>Tareas a realizar para este turno ({tareas.length})</span>
              </div>
            </div>

            <div className="add-task-row">
              <input 
                type="text" 
                className="input-field" 
                placeholder="Añadir una tarea o actividad..."
                value={nuevaTareaText}
                onChange={(e) => setNuevaTareaText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAgregarTarea(e);
                  }
                }}
              />
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleAgregarTarea}
              >
                <Plus size={16} />
                <span>Agregar</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '140px', overflowY: 'auto' }}>
              {tareas.map((t) => (
                <div key={t.id} className="task-item">
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.descripcion}</span>
                  <button 
                    type="button" 
                    onClick={() => handleEliminarTarea(t.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Eliminar tarea"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Notas o Requerimientos Especiales</label>
            <textarea 
              className="textarea-field"
              placeholder="Detalles sobre las preferencias del cliente..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={!!conflictError}>
              <Sparkles size={16} />
              <span>Agendar Turno</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
