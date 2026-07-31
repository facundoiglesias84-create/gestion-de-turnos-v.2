import React, { useState } from 'react';
import { X, CheckSquare, Plus, Trash2, Clock, Phone, FileText, DollarSign, BookOpen, CalendarClock } from 'lucide-react';

export const TurnoDetailModal = ({ turno, isOpen, onClose, onUpdateTurno, tareasPredefinidas = [], onRequestStatusChange, onOpenReschedule }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPrice, setNewTaskPrice] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('');

  if (!isOpen || !turno) return null;

  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;
    const preset = tareasPredefinidas.find(tp => tp.id === presetId);
    if (preset) {
      setNewTaskText(preset.descripcion);
      setNewTaskPrice(preset.precio || '');
    }
  };

  const handleToggleTask = (taskId) => {
    const updatedTareas = turno.tareas.map((t) => 
      t.id === taskId ? { ...t, completada: !t.completada } : t
    );
    onUpdateTurno({ ...turno, tareas: updatedTareas });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: 'tk-' + Date.now(),
      descripcion: newTaskText.trim(),
      precio: parseFloat(newTaskPrice) || 0,
      completada: false
    };
    const updatedTareas = [...(turno.tareas || []), newTask];
    onUpdateTurno({ ...turno, tareas: updatedTareas });
    setNewTaskText('');
    setNewTaskPrice('');
    setSelectedPresetId('');
  };

  const handleDeleteTask = (taskId) => {
    const updatedTareas = turno.tareas.filter((t) => t.id !== taskId);
    onUpdateTurno({ ...turno, tareas: updatedTareas });
  };

  const handleStatusChange = (newStatus) => {
    if (onRequestStatusChange) {
      onRequestStatusChange(turno, newStatus);
    } else {
      onUpdateTurno({ ...turno, estado: newStatus });
    }
  };

  const totalTasks = turno.tareas ? turno.tareas.length : 0;
  const completedTasks = turno.tareas ? turno.tareas.filter((t) => t.completada).length : 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalPrecio = turno.tareas ? turno.tareas.reduce((acc, t) => acc + (t.precio || 0), 0) : 0;

  const badgeClass = turno.estado === 'nuevo' || turno.estado === 'pendiente'
    ? 'badge-pendiente'
    : turno.estado === 'confirmado'
    ? 'badge-confirmado'
    : 'badge-completado';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div>
            <span className={`badge ${badgeClass}`} style={{ marginBottom: '0.4rem' }}>
              {turno.estado === 'nuevo' ? 'NUEVO' : turno.estado.toUpperCase()}
            </span>
            <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
              {turno.clienteNombre}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> Fecha y Hora
            </div>
            <strong>{turno.fecha} ({turno.horaInicio} hs)</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Phone size={14} /> Teléfono
            </div>
            <strong>{turno.clienteTelefono || 'Sin registrar'}</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <DollarSign size={14} style={{ color: 'var(--accent-emerald)' }} /> Total del Turno
              </div>
              <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
                ${totalPrecio.toLocaleString('es-AR')}
              </strong>
            </div>

            <button 
              className="btn btn-secondary" 
              onClick={() => {
                onClose();
                if (onOpenReschedule) onOpenReschedule(turno);
              }}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            >
              <CalendarClock size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span>Reagendar</span>
            </button>
          </div>
        </div>

        {/* Cambiar Estado con Doble Confirmacion */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Cambiar Estado del Turno</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'nuevo', label: 'Nuevo' },
              { id: 'confirmado', label: 'Confirmado' },
              { id: 'finalizado', label: 'Finalizado' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                className={`badge badge-${st.id === 'nuevo' ? 'pendiente' : st.id === 'confirmado' ? 'confirmado' : 'completado'}`}
                onClick={() => handleStatusChange(st.id)}
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.45rem 0.75rem', 
                  fontSize: '0.75rem',
                  opacity: turno.estado === st.id ? 1 : 0.4,
                  transform: turno.estado === st.id ? 'scale(1.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAREAS */}
        <div className="tasks-section" style={{ margin: 0 }}>
          <div className="tasks-header">
            <div className="tasks-title">
              <CheckSquare size={16} />
              <span>Tareas a Realizar ({completedTasks} de {totalTasks})</span>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>{progressPercent}%</span>
          </div>

          <div className="progress-container" style={{ marginBottom: '0.85rem' }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          {/* Selector de Catálogo Predefinido */}
          {tareasPredefinidas.length > 0 && (
            <div className="form-group" style={{ marginBottom: '0.5rem' }}>
              <select 
                className="select-field"
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                style={{ fontSize: '0.825rem' }}
              >
                <option value="">-- Cargar tarea del catálogo predefinido --</option>
                {tareasPredefinidas.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.descripcion} (${tp.precio ? tp.precio.toLocaleString('es-AR') : 0})
                  </option>
                ))}
              </select>
            </div>
          )}

          <form onSubmit={handleAddTask} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.35rem', marginBottom: '0.6rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Nueva tarea..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <input 
              type="number" 
              className="input-field" 
              placeholder="Precio ($)"
              value={newTaskPrice}
              onChange={(e) => setNewTaskPrice(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              <Plus size={16} />
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.65rem', maxHeight: '180px', overflowY: 'auto' }}>
            {turno.tareas && turno.tareas.length > 0 ? (
              turno.tareas.map((t) => (
                <div 
                  key={t.id} 
                  className={`task-item ${t.completada ? 'completed' : ''}`}
                  onClick={() => handleToggleTask(t.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1 }}>
                    <input 
                      type="checkbox" 
                      className="task-checkbox"
                      checked={t.completada}
                      onChange={() => {}}
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {t.descripcion}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.825rem', color: 'var(--accent-emerald)', fontWeight: 700, marginLeft: '0.5rem' }}>
                    ${t.precio ? t.precio.toLocaleString('es-AR') : 0}
                  </span>

                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(t.id);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', marginLeft: '0.3rem' }}
                    title="Eliminar tarea"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.85rem' }}>
                No hay tareas asignadas para este turno.
              </div>
            )}
          </div>
        </div>

        {turno.notas && (
          <div style={{ marginTop: '1rem', padding: '0.65rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FileText size={13} /> Notas Adicionales
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{turno.notas}</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
