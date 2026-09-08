import React from 'react';
import { Plus } from 'lucide-react';

export const MobileNav = ({ onOpenNewTurno }) => {
  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
      <button 
        onClick={() => onOpenNewTurno()}
        aria-label="Agendar Turno"
        title="Agendar Nuevo Turno"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 6px 20px rgba(6, 182, 212, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Plus size={28} />
      </button>
    </div>
  );
};
