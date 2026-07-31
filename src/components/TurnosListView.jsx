import React, { useState } from 'react';
import { Search, Calendar as CalendarIcon, Clock, Phone, CheckSquare, Trash2, Edit3, CalendarPlus, Bell, CheckCircle2, PlayCircle } from 'lucide-react';
import { openCalendarEvent, scheduleTurnoReminder } from '../utils/calendarHelper';

export const TurnosListView = ({ 
  turnos, 
  selectedDate, 
  onSelectTurno, 
  onDeleteTurno, 
  onOpenNewTurno,
  onUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('proximos');
  const [onlySelectedDate, setOnlySelectedDate] = useState(true);

  const filteredTurnos = turnos.filter((t) => {
    if (onlySelectedDate && t.fecha !== selectedDate) return false;
    
    if (statusFilter === 'proximos') {
      if (t.estado === 'finalizado' || t.estado === 'cancelado') return false;
    } else if (statusFilter !== 'todos' && t.estado !== statusFilter) {
      return false;
    }
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = t.clienteNombre?.toLowerCase().includes(q);
      const serviceMatch = t.servicio?.toLowerCase().includes(q);
      const phoneMatch = t.clienteTelefono?.includes(q);
      return nameMatch || serviceMatch || phoneMatch;
    }

    return true;
  });

  const handleAdvanceStatus = (t) => {
    if (t.estado === 'nuevo' || t.estado === 'pendiente') {
      onUpdateStatus(t.id, 'confirmado');
    } else if (t.estado === 'confirmado') {
      onUpdateStatus(t.id, 'finalizado');
    }
  };

  const handlePushReminder = (t) => {
    scheduleTurnoReminder(t, 15);
    alert(`Recordatorio programado para el turno de ${t.clienteNombre} a las ${t.horaInicio} hs.`);
  };

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Buscar cliente, teléfono o servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.3rem', fontSize: '0.85rem' }}
            />
          </div>

          <button
            className={`btn ${onlySelectedDate ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setOnlySelectedDate(!onlySelectedDate)}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
          >
            <CalendarIcon size={15} />
            <span>{onlySelectedDate ? `Turnos de ${selectedDate}` : 'Ver Todos los Turnos'}</span>
          </button>
        </div>

        {/* Filtros de Estado Profesionales SIN EMOJIS */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.85rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          {[
            { id: 'proximos', label: 'Próximos' },
            { id: 'nuevo', label: 'Nuevos' },
            { id: 'confirmado', label: 'Confirmados' },
            { id: 'finalizado', label: 'Finalizados' },
            { id: 'todos', label: 'Todos' }
          ].map((st) => (
            <button
              key={st.id}
              className={`tab-btn ${statusFilter === st.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(st.id)}
              style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTurnos.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CalendarIcon size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3>No se encontraron turnos próximos</h3>
          <p style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
            {onlySelectedDate ? `No hay turnos activos para la fecha ${selectedDate}.` : 'No hay turnos que coincidan con la búsqueda.'}
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => onOpenNewTurno(selectedDate)}
            style={{ marginTop: '1rem', fontSize: '0.85rem' }}
          >
            Agendar un Nuevo Turno
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '0.85rem' }}>
          {filteredTurnos.map((t) => {
            const totalTasks = t.tareas ? t.tareas.length : 0;
            const completedTasks = t.tareas ? t.tareas.filter(task => task.completada).length : 0;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const totalPrecio = t.tareas ? t.tareas.reduce((acc, tk) => acc + (tk.precio || 0), 0) : 0;

            const badgeClass = t.estado === 'nuevo' || t.estado === 'pendiente' 
              ? 'badge-pendiente' 
              : t.estado === 'confirmado' 
              ? 'badge-confirmado' 
              : 'badge-completado';

            return (
              <div key={t.id} className="glass-panel" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <span className={`badge ${badgeClass}`}>
                      {t.estado === 'nuevo' ? 'NUEVO' : t.estado.toUpperCase()}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      <Clock size={14} />
                      <span>{t.horaInicio} hs</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
                    {t.clienteNombre}
                  </h3>

                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} />
                    <span>{t.clienteTelefono || 'Sin teléfono'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.45rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '0.85rem', fontSize: '0.825rem' }}>
                    <div><strong>Servicio:</strong> {t.servicio}</div>
                    <div style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>${totalPrecio.toLocaleString('es-AR')}</div>
                  </div>

                  {/* Tareas */}
                  <div className="tasks-section" style={{ margin: 0, marginBottom: '0.85rem', padding: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckSquare size={13} style={{ color: 'var(--accent-cyan)' }} />
                        Tareas ({completedTasks}/{totalTasks})
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{progress}%</span>
                    </div>

                    <div className="progress-container">
                      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* PASO A PASO PROFESIONAL DE ESTADO (SIN EMOJIS) */}
                <div style={{ marginBottom: '0.65rem' }}>
                  {t.estado === 'nuevo' || t.estado === 'pendiente' ? (
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleAdvanceStatus(t)}
                      style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem', gap: '0.4rem' }}
                    >
                      <PlayCircle size={15} />
                      <span>Confirmar Turno</span>
                    </button>
                  ) : t.estado === 'confirmado' ? (
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleAdvanceStatus(t)}
                      style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem', gap: '0.4rem', border: '1px solid var(--accent-emerald)', color: '#34d399' }}
                    >
                      <CheckCircle2 size={15} />
                      <span>Finalizar Turno</span>
                    </button>
                  ) : (
                    <div style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-muted)', padding: '0.25rem', fontWeight: 600 }}>
                      Turno Finalizado
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.65rem' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => openCalendarEvent(t)}
                    style={{ flex: 1, fontSize: '0.775rem', padding: '0.4rem 0.5rem', minHeight: '34px', gap: '0.35rem' }}
                    title="Agendar en el Calendario de Celular"
                  >
                    <CalendarPlus size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <span>Calendario</span>
                  </button>

                  <button 
                    className="btn btn-secondary"
                    onClick={() => handlePushReminder(t)}
                    style={{ flex: 1, fontSize: '0.775rem', padding: '0.4rem 0.5rem', minHeight: '34px', gap: '0.35rem' }}
                    title="Activar Recordatorio Notificación Push"
                  >
                    <Bell size={14} style={{ color: 'var(--accent-amber)' }} />
                    <span>Recordatorio</span>
                  </button>
                </div>

                {/* Acciones Secundarias */}
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onSelectTurno(t)}
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}
                  >
                    <Edit3 size={14} />
                    <span>Gestionar Tareas</span>
                  </button>

                  <button 
                    className="btn btn-danger btn-icon" 
                    onClick={() => onDeleteTurno(t.id)}
                    title="Eliminar Turno"
                    style={{ width: '38px', height: '38px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
