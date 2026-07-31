import React from 'react';
import { Calendar, ListFilter, Plus, BarChart3, Database } from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, onOpenNewTurno, onOpenXataConfig }) => {
  return (
    <nav className="mobile-nav">
      <button 
        className={`mobile-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
        onClick={() => setActiveTab('calendar')}
      >
        <Calendar size={20} />
        <span>Calendario</span>
      </button>

      <button 
        className={`mobile-nav-item ${activeTab === 'turnos' ? 'active' : ''}`}
        onClick={() => setActiveTab('turnos')}
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
        className={`mobile-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
        onClick={() => setActiveTab('stats')}
      >
        <BarChart3 size={20} />
        <span>Métricas</span>
      </button>

      <button 
        className="mobile-nav-item"
        onClick={onOpenXataConfig}
      >
        <Database size={20} />
        <span>Xata DB</span>
      </button>
    </nav>
  );
};
