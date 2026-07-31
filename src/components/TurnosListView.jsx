import React, { useState } from 'react';
import { Search, Calendar, Clock, User, Phone, CheckSquare, Trash2, Edit3, ArrowRight } from 'lucide-react';

export const TurnosListView = ({ 
  turnos, 
  selectedDate, 
  onSelectTurno, 
  onDeleteTurno, 
  onOpenNewTurno,
  onUpdateStatus 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [onlySelectedDate, setOnlySelectedDate] = useState(true);

  // Filtrar turnos
  const filteredTurnos = turnos.filter((t) => {
    if (onlySelectedDate && t.fecha !== selectedDate) return false;
    if (statusFilter !== 'todos' && t.estado !== statusFilter) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = t.clienteNombre?.toLowerCase().includes(q);
      const serviceMatch = t.servicio?.toLowerCase().includes(q);
      const phoneMatch = t.clienteTelefono?.includes(q);
      return nameMatch || serviceMatch || phoneMatch;
    }

    return true;
  });

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Búsqueda */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Buscar cliente, teléfono o servicio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Filtro por fecha seleccionada */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className={`btn ${onlySelectedDate ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setOnlySelectedDate(!onlySelectedDate)}
              style={{ fontSize: '0.85rem' }}
            >
              <Calendar size={16} />
              <span>{onlySelectedDate ? `Turnos de ${selectedDate}` : 'Ver Todos los Turnos'}</span>
            </button>
          </div>
        </div>

        {/* Filtros de Estado */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {['todos', 'confirmado', 'pendiente', 'completado', 'cancelado'].map((st) => (
            <button
              key={st}
              className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
              style={{ textTransform: 'capitalize' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tarjetas de Turnos */}
      {filteredTurnos.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3>No se encontraron turnos</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {onlySelectedDate ? `No hay turnos agendados para la fecha ${selectedDate}.` : 'No hay turnos que coincidan con la búsqueda.'}
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => onOpenNewTurno(selectedDate)}
            style={{ marginTop: '1.25rem' }}
          >
            Agendar un Nuevo Turno
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {filteredTurnos.map((t) => {
            const totalTasks = t.tareas ? t.tareas.length : 0;
            const completedTasks = t.tareas ? t.tareas.filter(task => task.completada).length : 0;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <div key={t.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${t.estado}`}>
                      {t.estado}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      <Clock size={15} />
                      <span>{t.horaInicio} - {t.horaFin}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                    {t.clienteNombre}
                  </h3>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} />
                    <span>{t.clienteTelefono || 'Sin teléfono'}</span>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    <strong>Servicio:</strong> {t.servicio}
                  </div>

                  {/* Sección de Tareas Asociadas */}
                  <div className="tasks-section" style={{ margin: 0, marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <CheckSquare size={14} style={{ color: 'var(--accent-cyan)' }} />
                        Tareas a Realizar ({completedTasks}/{totalTasks})
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{progress}%</span>
                    </div>

                    <div className="progress-container">
                      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>

                    {totalTasks > 0 && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {t.tareas.slice(0, 2).map((tk) => (
                          <div key={tk.id} style={{ fontSize: '0.775rem', color: tk.completada ? 'var(--text-muted)' : 'var(--text-secondary)', textDecoration: tk.completada ? 'line-through' : 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: tk.completada ? 'var(--accent-emerald)' : 'var(--text-muted)' }}></span>
                            {tk.descripcion}
                          </div>
                        ))}
                        {totalTasks > 2 && (
                          <span style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                            +{totalTasks - 2} tareas más...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onSelectTurno(t)}
                    style={{ flex: 1, fontSize: '0.825rem', padding: '0.45rem' }}
                  >
                    <Edit3 size={15} />
                    <span>Gestionar Tareas</span>
                  </button>

                  <button 
                    className="btn btn-danger btn-icon" 
                    onClick={() => onDeleteTurno(t.id)}
                    title="Eliminar Turno"
                  >
                    <Trash2 size={16} />
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
