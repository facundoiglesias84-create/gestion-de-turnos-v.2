import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export const StatsOverview = ({ turnos }) => {
  // Turnos pendientes (nuevos + confirmados)
  const turnosPendientes = turnos.filter(
    (t) => t.estado === 'nuevo' || t.estado === 'pendiente' || t.estado === 'confirmado'
  ).length;

  // Turnos completados (finalizados)
  const turnosCompletados = turnos.filter(
    (t) => t.estado === 'finalizado' || t.estado === 'completado'
  ).length;

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
          <Clock size={22} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{turnosPendientes}</div>
          <div className="stat-label">Turnos Pendientes</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
          <CheckCircle2 size={22} />
        </div>
        <div>
          <div className="stat-value" style={{ color: '#34d399' }}>{turnosCompletados}</div>
          <div className="stat-label">Turnos Completados</div>
        </div>
      </div>
    </div>
  );
};
