import React, { useState } from 'react';
import { X, CheckSquare, Plus, Trash2, Clock, Phone, Mail, FileText, CalendarPlus, ExternalLink, Bell } from 'lucide-react';
import { downloadIcsFile, getGoogleCalendarUrl, requestNotificationPermission, sendTurnoReminderNotification } from '../utils/calendarHelper';

export const TurnoDetailModal = ({ turno, isOpen, onClose, onUpdateTurno }) => {
  const [newTaskText, setNewTaskText] = useState('');

  if (!isOpen || !turno) return null;

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
      completada: false
    };
    const updatedTareas = [...(turno.tareas || []), newTask];
    onUpdateTurno({ ...turno, tareas: updatedTareas });
    setNewTaskText('');
  };

  const handleDeleteTask = (taskId) => {
    const updatedTareas = turno.tareas.filter((t) => t.id !== taskId);
    onUpdateTurno({ ...turno, tareas: updatedTareas });
  };

  const handleStatusChange = (newStatus) => {
    onUpdateTurno({ ...turno, estado: newStatus });
  };

  const handlePushReminder = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      sendTurnoReminderNotification(turno);
      alert(`🔔 Recordatorio activado para ${turno.clienteNombre}`);
    } else {
      alert('Por favor habilita las notificaciones en tu navegador.');
    }
  };

  const totalTasks = turno.tareas ? turno.tareas.length : 0;
  const completedTasks = turno.tareas ? turno.tareas.filter((t) => t.completada).length : 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera */}
        <div className="modal-header">
          <div>
            <span className={`badge badge-${turno.estado}`} style={{ marginBottom: '0.4rem' }}>
              {turno.estado}
            </span>
            <h2 className="modal-title" style={{ fontSize: '1.25rem' }}>
              {turno.clienteNombre}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        {/* Info general */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={14} /> Fecha y Hora
            </div>
            <strong>{turno.fecha} ({turno.horaInicio} hs)</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Servicio Solicitado</div>
            <strong>{turno.servicio}</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Phone size={14} /> Teléfono
            </div>
            <strong>{turno.clienteTelefono || 'Sin registrar'}</strong>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Mail size={14} /> Email
            </div>
            <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{turno.clienteEmail || 'Sin registrar'}</strong>
          </div>
        </div>

        {/* Exportar al Calendario del Celular / Recordatorio */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => downloadIcsFile(turno)}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
          >
            <CalendarPlus size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Descargar Evento Celular (.ics)</span>
          </button>

          <a 
            href={getGoogleCalendarUrl(turno)}
            target="_blank" 
            rel="noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', textDecoration: 'none' }}
          >
            <ExternalLink size={14} style={{ color: 'var(--accent-indigo)' }} />
            <span>Abrir en Google Calendar</span>
          </a>

          <button 
            className="btn btn-secondary" 
            onClick={handlePushReminder}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
          >
            <Bell size={14} style={{ color: 'var(--accent-amber)' }} />
            <span>Recordatorio Push</span>
          </button>
        </div>

        {/* Cambiar Estado */}
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label>Estado del Turno</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['confirmado', 'pendiente', 'completado', 'cancelado'].map((st) => (
              <button
                key={st}
                type="button"
                className={`badge badge-${st}`}
                onClick={() => handleStatusChange(st)}
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.45rem 0.75rem', 
                  fontSize: '0.75rem',
                  opacity: turno.estado === st ? 1 : 0.4,
                  transform: turno.estado === st ? 'scale(1.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* TAREAS A REALIZAR */}
        <div className="tasks-section" style={{ margin: 0 }}>
          <div className="tasks-header">
            <div className="tasks-title">
              <CheckSquare size={16} />
              <span>Tareas a Realizar ({completedTasks} de {totalTasks} completadas)</span>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>{progressPercent}%</span>
          </div>

          <div className="progress-container" style={{ marginBottom: '0.85rem' }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <form onSubmit={handleAddTask} className="add-task-row">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Agregar nueva tarea..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary">
              <Plus size={16} />
              <span>Agregar</span>
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

                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(t.id);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
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
