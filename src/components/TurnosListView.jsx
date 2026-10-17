import React, { useState, useRef } from 'react';
import { Search, Calendar as CalendarIcon, CalendarClock, Plus, CheckCircle2, ListChecks, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { IconField } from './IconField';
import { todayAR, addDays, weekdayOf } from '../utils/dateAR';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const TurnosListView = ({
  turnos,
  selectedDate,
  onSelectDate,
  onSelectTurno,
  onOpenNewTurno
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('proximos'); // 'proximos', 'pasados', 'todos'
  const [onlySelectedDate, setOnlySelectedDate] = useState(true);

  const datePickerRef = useRef(null);

  // Generadores de fecha (ISO YYYY-MM-DD)
  const todayStr = todayAR();
  const yesterdayStr = addDays(todayStr, -1);
  const tomorrowStr = addDays(todayStr, 1);

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

  const formatLongDate = (dateStr) => {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-').map(Number);
    return `${DIAS[weekdayOf(dateStr)]} ${d} de ${MESES[m - 1]}`;
  };

  const getDateLabel = (dateStr) => {
    if (dateStr === todayStr) return 'Hoy';
    if (dateStr === tomorrowStr) return 'Mañana';
    if (dateStr === yesterdayStr) return 'Ayer';
    return formatLongDate(dateStr);
  };

  const selectDate = (dateStr) => {
    onSelectDate(dateStr);
    setOnlySelectedDate(true);
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

  const getPrecio = (t) => (t.tareas || []).reduce((acc, tk) => acc + (tk.precio || 0), 0);
  const formatPrecio = (n) => `$${n.toLocaleString('es-AR')}`;

  // Agrupar por día: los próximos del más cercano al más lejano, los pasados del más reciente al más viejo
  const groups = Object.values(
    filteredTurnos.reduce((acc, t) => {
      (acc[t.fecha] ||= { fecha: t.fecha, turnos: [] }).turnos.push(t);
      return acc;
    }, {})
  )
    .map((g) => ({
      ...g,
      isPast: g.fecha < todayStr,
      total: g.turnos.reduce((acc, t) => acc + getPrecio(t), 0),
      turnos: [...g.turnos].sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''))
    }))
    .sort((a, b) => {
      if (a.isPast !== b.isPast) return a.isPast ? 1 : -1;
      return a.isPast ? b.fecha.localeCompare(a.fecha) : a.fecha.localeCompare(b.fecha);
    });

  const hasActiveFilters = !onlySelectedDate || selectedDate !== todayStr || searchQuery.trim() !== '';

  const clearFilters = () => {
    onSelectDate(todayStr);
    setOnlySelectedDate(true);
    setSearchQuery('');
  };

  const listTitle = onlySelectedDate ? getDateLabel(selectedDate) : 'Todas las fechas';

  return (
    <div>
      {/* Barra principal: Próximos / Realizados / Todos */}
      <div className="glass-nav-wrap">
        <div className="glass-nav" role="tablist" aria-label="Filtrar por momento">
          {[
            { id: 'proximos', label: 'Próximos', Icon: CalendarClock },
            { id: 'pasados', label: 'Realizados', Icon: CheckCircle2 },
            { id: 'todos', label: 'Todos', Icon: ListChecks }
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={timeFilter === id}
              className={`tab-btn ${timeFilter === id ? 'active' : ''}`}
              onClick={() => setTimeFilter(id)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <section className="glass-panel filters-panel" aria-labelledby="filtros-titulo">
        <div className="filters-header">
          <h2 className="filters-title" id="filtros-titulo">
            <SlidersHorizontal size={18} aria-hidden="true" />
            Filtros
          </h2>
          {hasActiveFilters && (
            <button className="filters-clear" onClick={clearFilters}>
              Limpiar
            </button>
          )}
        </div>

        <div className="filters-body">
          <div className="filter-group">
            <span className="section-label">Día</span>
            <div className="chip-row">
              <button
                className={`date-chip ${onlySelectedDate && selectedDate === yesterdayStr ? 'active' : ''}`}
                onClick={() => selectDate(yesterdayStr)}
              >
                Ayer
              </button>
              <button
                className={`date-chip ${onlySelectedDate && selectedDate === todayStr ? 'active' : ''}`}
                onClick={() => selectDate(todayStr)}
              >
                Hoy
              </button>
              <button
                className={`date-chip ${onlySelectedDate && selectedDate === tomorrowStr ? 'active' : ''}`}
                onClick={() => selectDate(tomorrowStr)}
              >
                Mañana
              </button>

              <label className="date-picker-btn" onClick={handleOpenDatePicker} title="Elegir otra fecha">
                <CalendarIcon size={18} style={{ color: 'var(--primary)' }} aria-hidden="true" />
                <span>{formatDisplayDate(selectedDate)}</span>
                <input
                  ref={datePickerRef}
                  type="date"
                  aria-label="Elegir fecha"
                  value={selectedDate}
                  onChange={(e) => {
                    if (e.target.value) selectDate(e.target.value);
                  }}
                />
              </label>

              <button
                className={`date-chip ${!onlySelectedDate ? 'active' : ''}`}
                onClick={() => setOnlySelectedDate(!onlySelectedDate)}
              >
                Todas
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label className="section-label" htmlFor="buscar-turnos">Buscar</label>
            <IconField icon={Search}>
              <input
                id="buscar-turnos"
                type="search"
                placeholder="Cliente o servicio"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </IconField>
          </div>
        </div>
      </section>

      <div className="list-heading">
        <h3>{listTitle}</h3>
        <span className="list-count">{filteredTurnos.length} {filteredTurnos.length === 1 ? 'turno' : 'turnos'}</span>
      </div>

      {filteredTurnos.length === 0 ? (
        <div className="glass-panel empty-state">
          <div className="empty-icon">
            <CalendarIcon size={28} aria-hidden="true" />
          </div>
          <h3>No hay turnos acá</h3>
          <p>
            {onlySelectedDate
              ? `No tenés turnos para ${getDateLabel(selectedDate).toLowerCase()}.`
              : 'Ningún turno coincide con la búsqueda.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => onOpenNewTurno(selectedDate)}
            style={{ marginTop: '1.1rem' }}
          >
            <Plus size={18} aria-hidden="true" />
            Agendar turno
          </button>
        </div>
      ) : (
        <div className="day-groups">
          {groups.map((g) => (
            <section key={g.fecha} className={`day-group ${g.isPast ? 'is-past' : ''}`}>
              <header className="day-group-header">
                <h4>
                  {getDateLabel(g.fecha)}
                  {g.isPast && <span className="day-done">Realizado</span>}
                </h4>
                <span className="day-group-meta">
                  {g.turnos.length} {g.turnos.length === 1 ? 'turno' : 'turnos'}
                  {g.total > 0 && <> · <strong>{formatPrecio(g.total)}</strong></>}
                </span>
              </header>

              <div className="glass-panel day-list">
                {g.turnos.map((t) => {
                  const precio = getPrecio(t);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className="turno-row"
                      onClick={() => onSelectTurno(t)}
                    >
                      <span className="turno-row-time">{t.horaInicio || '--:--'}</span>
                      <span className="turno-row-info">
                        <span className="turno-row-name">{t.clienteNombre}</span>
                        {t.servicio && <span className="turno-row-service">{t.servicio}</span>}
                      </span>
                      {precio > 0 && <span className="turno-row-price">{formatPrecio(precio)}</span>}
                      <ChevronRight size={20} className="turno-row-chevron" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
