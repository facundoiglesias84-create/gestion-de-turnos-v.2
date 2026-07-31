import React from 'react';
import { Calendar, ListFilter, Plus, Tag } from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, onOpenNewTurno }) => {
  return (
    <nav className="mobile-nav">
      <button 
        className={`mobile-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
        onClick={() => setActiveTab('calendar')}
        style={{ width: '25%' }}
      >
        <Calendar size={20} />
        <span>Calendario</span>
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'turnos' ? 'active' : ''}`}
        onClick={() => setActiveTab('turnos')}
        style={{ width: '25%' }}
      >
        <ListFilter size={20} />
        <span>Turnos</span>
      </button>

      <button 
        className="mobile-add-btn"
        onClick={() => onOpenNewTurno()}
        aria-label="Agendar Turno"
      >
        <Plus size={24} />
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'servicios' ? 'active' : ''}`}
        onClick={() => setActiveTab('servicios')}
        style={{ width: '25%' }}
      >
        <Tag size={20} />
        <span>Servicios</span>
      </button>
    </nav>
  );
};
