import React from 'react';
import { Calendar, ListFilter, Plus, Tag } from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, onOpenNewTurno }) => {
  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-side left">
        <button 
          className={`mobile-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar size={19} />
          <span>Calendario</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'turnos' ? 'active' : ''}`}
          onClick={() => setActiveTab('turnos')}
        >
          <ListFilter size={19} />
          <span>Turnos</span>
        </button>
      </div>

      <button 
        className="mobile-add-btn"
        onClick={() => onOpenNewTurno()}
        aria-label="Agendar Turno"
      >
        <Plus size={26} />
      </button>

      <div className="mobile-nav-side right">
        <button 
          className={`mobile-nav-item ${activeTab === 'servicios' ? 'active' : ''}`}
          onClick={() => setActiveTab('servicios')}
        >
          <Tag size={19} />
          <span>Servicios</span>
        </button>
      </div>
    </nav>
  );
};
