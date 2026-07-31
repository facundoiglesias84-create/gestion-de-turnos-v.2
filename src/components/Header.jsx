import React from 'react';
import { Plus, Database, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export const Header = ({ onOpenNewTurno, onOpenXataConfig, xataConnected, activeDate }) => {
  const formattedDate = new Date(activeDate + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-area">
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="logo-title">TurnoFlow</h1>
            <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Gestión de Turnos & Tareas
            </div>
          </div>
        </div>

        <div className="date-indicator">
          <Clock size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span>{formattedDate}</span>
        </div>

        <div className="header-actions">
          {/* Badge de Xata visible siempre */}
          <button 
            className="btn btn-secondary" 
            onClick={onOpenXataConfig}
            style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem', minHeight: '36px' }}
            title="Ver estado de conexión Xata.io"
          >
            <Database size={15} style={{ color: xataConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: xataConnected ? '#34d399' : '#fbbf24' }}>
              {xataConnected ? 'Xata Live' : 'Xata Local'}
            </span>
          </button>

          {/* Botón de Agendar visible solo en desktop para no recargar mobile */}
          <button 
            className="btn btn-primary header-actions-desktop" 
            onClick={() => onOpenNewTurno()}
            style={{ fontSize: '0.85rem', minHeight: '36px' }}
          >
            <Plus size={16} />
            <span>Agendar Turno</span>
          </button>
        </div>
      </div>
    </header>
  );
};
