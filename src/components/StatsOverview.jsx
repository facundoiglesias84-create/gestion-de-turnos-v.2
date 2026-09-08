import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export const StatsOverview = ({ turnos }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Turnos próximos (fecha de hoy en adelante)
  const turnosProximos = turnos.filter((t) => t.fecha >= todayStr).length;

  // Turnos ya realizados/pasados (fecha anterior a hoy)
  const turnosPasados = turnos.filter((t) => t.fecha < todayStr).length;

  return (
    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
      <div className="glass-panel stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0.85rem' }}>
        <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', marginBottom: '0.35rem' }}>
          <Clock size={20} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="stat-value" style={{ color: 'var(--accent-cyan)', fontSize: '1.25rem', fontWeight: 800 }}>{turnosProximos}</div>
          <div className="stat-label" style={{ fontSize: '0.75rem' }}>Turnos Próximos</div>
        </div>
      </div>

      <div className="glass-panel stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0.85rem' }}>
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', marginBottom: '0.35rem' }}>
          <CheckCircle2 size={20} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="stat-value" style={{ color: '#34d399', fontSize: '1.25rem', fontWeight: 800 }}>{turnosPasados}</div>
          <div className="stat-label" style={{ fontSize: '0.75rem' }}>Turnos Realizados</div>
        </div>
      </div>
    </div>
  );
};
