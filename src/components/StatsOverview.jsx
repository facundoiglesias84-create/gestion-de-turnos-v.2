import React from 'react';
import { Calendar, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export const StatsOverview = ({ turnos, selectedDate }) => {
  // Filtros de estadísticas
  const totalTurnos = turnos.length;
  
  const turnosHoy = turnos.filter(t => t.fecha === selectedDate);
  const totalTurnosHoy = turnosHoy.length;

  const totalTareas = turnos.reduce((acc, t) => acc + (t.tareas ? t.tareas.length : 0), 0);
  const tareasCompletadas = turnos.reduce((acc, t) => {
    const comp = t.tareas ? t.tareas.filter(task => task.completada).length : 0;
    return acc + comp;
  }, 0);

  const porcentajeProgreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
          <Calendar size={22} />
        </div>
        <div>
          <div className="stat-value">{totalTurnosHoy}</div>
          <div className="stat-label">Turnos Seleccionados</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}>
          <Clock size={22} />
        </div>
        <div>
          <div className="stat-value">{totalTurnos}</div>
          <div className="stat-label">Total Registrados</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
          <ListTodo size={22} />
        </div>
        <div>
          <div className="stat-value">{totalTareas - tareasCompletadas}</div>
          <div className="stat-label">Tareas Pendientes</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
          <CheckCircle2 size={22} />
        </div>
        <div>
          <div className="stat-value">{porcentajeProgreso}%</div>
          <div className="stat-label">Avance de Tareas</div>
        </div>
      </div>
    </div>
  );
};
