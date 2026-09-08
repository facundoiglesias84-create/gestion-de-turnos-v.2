import React, { useState, useRef } from 'react';
import { Search, Calendar as CalendarIcon, Clock, Phone, Trash2, Edit3, CalendarClock } from 'lucide-react';

export const TurnosListView = ({ 
  turnos, 
  selectedDate,
  onSelectDate,
  onSelectTurno, 
  onDeleteTurno, 
  onOpenNewTurno,
  onOpenReschedule
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('proximos'); // 'proximos', 'pasados', 'todos'
  const [onlySelectedDate, setOnlySelectedDate] = useState(true);

  const datePickerRef = useRef(null);

  // Generadores de fecha (ISO YYYY-MM-DD)
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];

  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(todayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const handleOpenDatePicker = () => {
    if (datePickerRef.current) {
      if (typeof datePickerRef.current.showPicker === 'function') {
        try {
          datePickerRef.current.showPicker();
        } catch (e) {
          datePickerRef.current.focus();
          datePickerRef.current.click();
        }
      } else {
        datePickerRef.current.focus();
        datePickerRef.current.click();
      }
    }
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const filteredTurnos = turnos.filter((t) => {
    if (onlySelectedDate && t.fecha !== selectedDate) return false;
    
    if (timeFilter === 'proximos' && t.fecha < todayStr) return false;
    if (timeFilter === 'pasados' && t.fecha >= todayStr) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const nameMatch = t.clienteNombre?.toLowerCase().includes(q);
      const serviceMatch = t.servicio?.toLowerCase().includes(q);
      const phoneMatch = t.clienteTelefono?.includes(q);
      return nameMatch || serviceMatch || phoneMatch;
    }

    return true;
  });

  const getTurnoBadge = (fechaStr) => {
    if (fechaStr < todayStr) {
      return { text: 'REALIZADO', class: 'badge-completado' };
    } else if (fechaStr === todayStr) {
      return { text: 'HOY', class: 'badge-confirmado' };
    } else {
      return { text: 'PRÓXIMO', class: 'badge-pendiente' };
    }
  };

  return (
    <div style={{ marginTop: '0.75rem' }}>
      {/* Panel de Selección de Fecha y Filtros (Totalmente Centrado) */}
      <div className="glass-panel" style={{ padding: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
        
        {/* Selector Rápido de Fecha (Centrado) */}
        <div style={{ marginBottom: '1.1rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 800, textAlign: 'center', marginBottom: '0.6rem' }}>
            Fecha Seleccionada
          </div>
          
          {/* Chips Ayer/Hoy/Mañana Centrados */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', marginBottom: '0.65rem' }}>
            <button
              className={`date-chip ${selectedDate === yesterdayStr ? 'active' : ''}`}
              onClick={() => { onSelectDate(yesterdayStr); setOnlySelectedDate(true); }}
            >
              Ayer
            </button>
            <button
              className={`date-chip ${selectedDate === todayStr ? 'active' : ''}`}
              onClick={() => { onSelectDate(todayStr); setOnlySelectedDate(true); }}
            >
              HOY
            </button>
            <button
              className={`date-chip ${selectedDate === tomorrowStr ? 'active' : ''}`}
              onClick={() => { onSelectDate(tomorrowStr); setOnlySelectedDate(true); }}
            >
              Mañana
            </button>
          </div>

          {/* Botón de Fecha Táctil Gigante (Abre Calendario al Tocar Cualquier Parte del Botón) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            <div 
              onClick={handleOpenDatePicker}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem', 
                background: 'var(--bg-input)', 
                padding: '0.45rem 1.1rem', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                position: 'relative',
                minHeight: '42px',
                userSelect: 'none',
                minWidth: '160px'
              }}
              title="Toca para elegir fecha en el calendario"
            >
              <CalendarIcon size={16} style={{ color: 'var(--accent-cyan)' }} />
              
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {formatDisplayDate(selectedDate)}
              </span>

              <input 
                ref={datePickerRef}
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    onSelectDate(e.target.value);
                    setOnlySelectedDate(true);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              />
            </div>

            <button
              className={`date-chip ${!onlySelectedDate ? 'active' : ''}`}
              onClick={() => setOnlySelectedDate(!onlySelectedDate)}
              style={{ minHeight: '42px' }}
            >
              {onlySelectedDate ? 'Ver Todos' : 'Filtrando Todos'}
            </button>
          </div>
        </div>

        {/* Buscador Centrado */}
        <div style={{ maxWidth: '440px', margin: '0 auto 0.85rem', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Buscar por cliente, teléfono o servicio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.4rem', textAlign: 'center', fontSize: '0.825rem', minHeight: '40px' }}
          />
        </div>

        {/* Filtro Temporal Centrado */}
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { id: 'proximos', label: 'Próximos' },
            { id: 'pasados', label: 'Realizados' },
            { id: 'todos', label: 'Todos' }
          ].map((st) => (
            <button
              key={st.id}
              className={`tab-btn ${timeFilter === st.id ? 'active' : ''}`}
              onClick={() => setTimeFilter(st.id)}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tarjetas (Centradas) */}
      {filteredTurnos.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CalendarIcon size={36} style={{ margin: '0 auto 0.65rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>No hay turnos registrados</h3>
          <p style={{ marginTop: '0.3rem', fontSize: '0.825rem' }}>
            {onlySelectedDate ? `Sin turnos agendados para el ${selectedDate}.` : 'No hay turnos que coincidan con la búsqueda.'}
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => onOpenNewTurno(selectedDate)}
            style={{ marginTop: '1rem', fontSize: '0.825rem', padding: '0.45rem 0.9rem' }}
          >
            + Agendar Turno
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.9rem' }}>
          {filteredTurnos.map((t) => {
            const totalPrecio = t.tareas && t.tareas.length > 0 
              ? t.tareas.reduce((acc, tk) => acc + (tk.precio || 0), 0) 
              : 0;
            const badgeInfo = getTurnoBadge(t.fecha);

            return (
              <div key={t.id} className="glass-panel turno-card" style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                {/* Cabecera Tarjeta: Hora e Indicador de Fecha Centrados */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    <Clock size={14} />
                    <span>{t.horaInicio ? `${t.horaInicio} hs` : 'Sin hora'}</span>
                  </div>

                  <span className={`badge ${badgeInfo.class}`}>
                    {badgeInfo.text}
                  </span>
                </div>

                {/* Info Cliente Centrada */}
                <div style={{ marginBottom: '0.75rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem', textAlign: 'center' }}>
                    {t.clienteNombre}
                  </h3>
                  
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <Phone size={13} />
                    <span>{t.clienteTelefono || 'Sin teléfono'}</span>
                  </div>
                </div>

                {/* Detalle Servicio y Precio Centrados */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justify: 'center', 
                  gap: '0.2rem',
                  background: 'rgba(255, 255, 255, 0.03)', 
                  padding: '0.55rem 0.75rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)', 
                  marginBottom: '0.85rem', 
                  fontSize: '0.825rem',
                  textAlign: 'center'
                }}>
                  <div><strong>Tarea:</strong> {t.servicio}</div>
                  {totalPrecio > 0 && (
                    <div style={{ color: 'var(--accent-emerald)', fontWeight: 800, fontSize: '0.95rem' }}>
                      ${totalPrecio.toLocaleString('es-AR')}
                    </div>
                  )}
                </div>

                {/* Botones de Acción Secundarios Centrados */}
                <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center', marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onOpenReschedule(t)}
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem', gap: '0.35rem', justifyContent: 'center' }}
                    title="Reagendar turno"
                  >
                    <CalendarClock size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <span>Reagendar</span>
                  </button>

                  <button 
                    className="btn btn-secondary" 
                    onClick={() => onSelectTurno(t)}
                    style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem', gap: '0.35rem', justifyContent: 'center' }}
                    title="Editar Turno"
                  >
                    <Edit3 size={14} />
                    <span>Editar</span>
                  </button>

                  <button 
                    className="btn btn-danger btn-icon" 
                    onClick={() => onDeleteTurno(t.id)}
                    title="Eliminar Turno"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
