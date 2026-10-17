import React from 'react';
import { Plus } from 'lucide-react';

export const Header = ({ onOpenNewTurno }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-area">
          <h1 className="logo-title">Turnos</h1>
          <div className="logo-subtitle">Tu agenda del día</div>
        </div>

        <button
          className="btn btn-primary header-new-btn"
          onClick={() => onOpenNewTurno()}
        >
          <Plus size={20} aria-hidden="true" />
          <span>Nuevo turno</span>
        </button>
      </div>
    </header>
  );
};
