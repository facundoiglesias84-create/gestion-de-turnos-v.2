import React from 'react';
import { Calendar, ListFilter, Plus, Tag } from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, onOpenNewTurno }) => {
  return (
    <nav className="mobile-nav-three">
      {/* 1. Calendario (Izquierda) */}
      <button 
        className={`mobile-nav-col ${activeTab === 'calendar' ? 'active' : ''}`}
        onClick={() => setActiveTab('calendar')}
      >
        <Calendar size={19} />
        <span>Calendario</span>
      </button>

      {/* 2. Turnos con el botón + flotante directamente ARRIBA de Turnos */}
      <div className="mobile-nav-col center-col">
        <button 
          className="mobile-floating-plus"
          onClick={() => onOpenNewTurno()}
          aria-label="Agendar Turno"
          title="Agendar Turno"
        >
          <Plus size={24} />
        </button>

        <button 
          className={`mobile-nav-col-inner ${activeTab === 'turnos' ? 'active' : ''}`}
          onClick={() => setActiveTab('turnos')}
        >
          <ListFilter size={18} />
          <span>Turnos</span>
        </button>
      </div>

      {/* 3. Servicios (Derecha) */}
      <button 
        className={`mobile-nav-col ${activeTab === 'servicios' ? 'active' : ''}`}
        onClick={() => setActiveTab('servicios')}
      >
        <Tag size={19} />
        <span>Servicios</span>
      </button>
    </nav>
  );
};
