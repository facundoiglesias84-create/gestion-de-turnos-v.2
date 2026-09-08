import React from 'react';
import { Plus, Clock } from 'lucide-react';

export const Header = ({ onOpenNewTurno, activeDate }) => {
  const getFechaCompleta = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const nombreDia = dias[dateObj.getDay()];
    const nombreMes = meses[dateObj.getMonth()];

    return `${nombreDia} ${day} de ${nombreMes}`;
  };

  const formattedDate = getFechaCompleta(activeDate);

  return (
    <header className="app-header">
      <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="logo-area">
          <img 
            src="/logo.jpg" 
            alt="Turnos Logo" 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '1px solid var(--accent-cyan)'
            }} 
          />
          <div>
            <h1 className="logo-title" style={{ fontSize: '1.1rem' }}>Turnos</h1>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Gestión & Agendamiento
            </div>
          </div>
        </div>

        <div className="date-indicator" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.3rem 0.75rem', fontWeight: 600 }}>
          <Clock size={14} style={{ color: 'var(--accent-cyan)' }} />
          <span>{formattedDate}</span>
        </div>

        <div className="header-actions">
          <button 
            className="btn btn-primary header-actions-desktop" 
            onClick={() => onOpenNewTurno()}
            style={{ fontSize: '0.825rem', minHeight: '34px', padding: '0.35rem 0.75rem' }}
          >
            <Plus size={15} />
            <span>Agendar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
