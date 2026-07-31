import React from 'react';
import { Calendar, ListFilter, Plus, BarChart3, Tag } from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, onOpenNewTurno }) => {
  return (
    <nav className="mobile-nav">
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
      >
        <Tag size={19} />
        <span>Servicios</span>
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
        onClick={() => setActiveTab('stats')}
      >
        <BarChart3 size={19} />
        <span>Métricas</span>
      </button>
    </nav>
  );
};
