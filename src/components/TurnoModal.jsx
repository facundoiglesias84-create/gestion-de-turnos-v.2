import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Plus, Trash2, CheckSquare, Sparkles, AlertTriangle, DollarSign, BookOpen } from 'lucide-react';

export const TurnoModal = ({ isOpen, onClose, onSave, defaultDate, turnosExistentes = [], tareasPredefinidas = [] }) => {
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [fecha, setFecha] = useState(defaultDate || new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [notas, setNotas] = useState('');

  // Tareas
  const [tareas, setTareas] = useState([]);
  const [nuevaTareaText, setNuevaTareaText] = useState('');
  const [nuevaTareaPrecio, setNuevaTareaPrecio] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('');

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
    const existe = turnosExistentes.some((t) => {
      if (t.estado === 'cancelado' || t.estado === 'finalizado') return false;
      return t.fecha === dateToCheck && t.horaInicio === timeToCheck;
    });

    if (existe) {
      setErrorDuplicado(`⚠️ Ya existe un turno agendado para la fecha ${dateToCheck} a las ${timeToCheck} hs.`);
    } else {
      setErrorDuplicado('');
    }
  };

  if (!isOpen) return null;

  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;
    const preset = tareasPredefinidas.find(tp => tp.id === presetId);
    if (preset) {
      setNuevaTareaText(preset.descripcion);
      setNuevaTareaPrecio(preset.precio || '');
    }
  };

  const handleAddTarea = (e) => {
    e.preventDefault();
    if (!nuevaTareaText.trim()) return;

    const nueva = {
      id: 'tk-' + Date.now(),
      descripcion: nuevaTareaText.trim(),
      precio: parseFloat(nuevaTareaPrecio) || 0,
      completada: false
    };

    setTareas([...tareas, nueva]);
    setNuevaTareaText('');
    setNuevaTareaPrecio('');
    setSelectedPresetId('');
  };

  const handleDeleteTarea = (id) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorDuplicado) return;

    const nuevoTurno = {
      id: 't-' + Date.now(),
      clienteNombre: clienteNombre.trim(),
      clienteTelefono: clienteTelefono.trim(),
      clienteEmail: clienteEmail.trim(),
      fecha,
      horaInicio,
      horaFin: horaInicio,
      servicio: 'Turno de Servicio',
      estado: 'nuevo',
      notas: notas.trim(),
      tareas,
      createdAt: new Date().toISOString()
    };

    onSave(nuevoTurno);

    // Resetear formulario
    setClienteNombre('');
    setClienteTelefono('');
    setClienteEmail('');
    setHoraInicio('09:00');
    setNotas('');
    setTareas([]);
    setNuevaTareaText('');
    setNuevaTareaPrecio('');
    setSelectedPresetId('');
    onClose();
  };

  const totalPrecioCalculado = tareas.reduce((acc, t) => acc + (t.precio || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />
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
          {/* CLIENTE */}
          <div className="form-group">
            <label>Nombre y Apellido del Cliente *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ej: Juan Pérez"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Teléfono (WhatsApp)</label>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="+54 9 11 ..."
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email (Opcional)</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="cliente@email.com"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
              />
            </div>
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

          {/* SECCIÓN DE TAREAS Y PRECIOS (Con selector desplegable de catálogo) */}
          <div className="tasks-section" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <div className="tasks-title">
                <CheckSquare size={16} />
                <span>Tareas a Realizar ({tareas.length})</span>
              </div>
              
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                Total: ${totalPrecioCalculado.toLocaleString('es-AR')}
              </div>
            </div>

            {/* Selector Desplegable de Catálogo Predefinido */}
            {tareasPredefinidas.length > 0 && (
              <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.775rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BookOpen size={13} /> Seleccionar tarea del catálogo predefinido:
                </label>
                <select 
                  className="select-field"
                  value={selectedPresetId}
                  onChange={(e) => handleSelectPreset(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <option value="">-- Cargar desde el catálogo --</option>
                  {tareasPredefinidas.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.descripcion} (${tp.precio ? tp.precio.toLocaleString('es-AR') : 0})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Formulario Manual de Tarea */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.35rem', marginBottom: '0.6rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Descripción de la tarea..."
                value={nuevaTareaText}
                onChange={(e) => setNuevaTareaText(e.target.value)}
              />
              <input 
                type="number" 
                className="input-field" 
                placeholder="Precio ($)"
                value={nuevaTareaPrecio}
                onChange={(e) => setNuevaTareaPrecio(e.target.value)}
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleAddTarea}
                title="Añadir Tarea"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Lista de Tareas Agregadas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '140px', overflowY: 'auto' }}>
              {tareas.length > 0 ? (
                tareas.map((t) => (
                  <div key={t.id} className="task-item" style={{ cursor: 'default' }}>
                    <span style={{ fontSize: '0.85rem', flex: 1 }}>{t.descripcion}</span>
                    <span style={{ fontSize: '0.825rem', color: 'var(--accent-emerald)', fontWeight: 700, marginLeft: '0.5rem' }}>
                      ${t.precio ? t.precio.toLocaleString('es-AR') : 0}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteTarea(t.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', marginLeft: '0.3rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.5rem' }}>
                  No has agregado tareas todavía.
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Notas o Detalle Adicional</label>
            <textarea 
              className="textarea-field" 
              placeholder="Detalles sobre la atención o solicitud del cliente..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={!!errorDuplicado}>
              <Plus size={16} />
              <span>Agendar Turno</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
