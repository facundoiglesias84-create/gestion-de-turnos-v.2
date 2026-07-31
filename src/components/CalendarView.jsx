import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CalendarView = ({ turnos, selectedDate, setSelectedDate, onOpenNewTurno }) => {
  const initialDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
  
  const [currentYear, setCurrentYear] = useState(initialDateObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDateObj.getMonth());

  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  const getDaysInMonth = (year, month) => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = (firstDayIndex === 0 ? 6 : firstDayIndex - 1);
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ dayNum, isCurrentMonth: false, dateStr });
    }

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dayNum: i, isCurrentMonth: true, dateStr });
    }

    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dayNum: i, isCurrentMonth: false, dateStr });
    }

    return days;
  };

  const daysGrid = getDaysInMonth(currentYear, currentMonth);

  return (
    <div className="glass-panel calendar-card">
      <div className="calendar-header">
        <div className="calendar-title">
          <CalendarIcon size={20} style={{ color: 'var(--accent-cyan)' }} />
          <h2>{MONTH_NAMES[currentMonth]} {currentYear}</h2>
        </div>

        <div className="calendar-controls">
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handleGoToday}
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.6rem', minHeight: '34px' }}
            >
              Hoy
            </button>

            <button className="btn btn-secondary btn-icon" onClick={handlePrevMonth} style={{ width: '34px', height: '34px' }} aria-label="Mes anterior">
              <ChevronLeft size={18} />
            </button>

            <button className="btn btn-secondary btn-icon" onClick={handleNextMonth} style={{ width: '34px', height: '34px' }} aria-label="Mes siguiente">
              <ChevronRight size={18} />
            </button>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={() => onOpenNewTurno(selectedDate)}
            style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem', minHeight: '34px' }}
          >
            <Plus size={15} />
            <span className="desktop-only">Agendar en esta fecha</span>
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="weekday-header">
            {wd}
          </div>
        ))}

        {daysGrid.map(({ dayNum, isCurrentMonth, dateStr }) => {
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const dayTurnos = turnos.filter((t) => t.fecha === dateStr);

          return (
            <div
              key={dateStr}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <div className="day-number">
                <span>{dayNum}</span>
                {isToday && <span className="today-dot" title="Hoy"></span>}
              </div>

              <div className="day-turnos-list">
                {dayTurnos.map((t) => {
                  const tasksDone = t.tareas ? t.tareas.filter(tk => tk.completada).length : 0;
                  const totalTasks = t.tareas ? t.tareas.length : 0;

                  return (
                    <div
                      key={t.id}
                      className={`mini-turno-chip ${t.estado}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Al tocar la celda o el chip SOLO filtra la fecha en lugar de abrir el modal de edicion
                        setSelectedDate(dateStr);
                      }}
                      title={`Turno de ${t.clienteNombre} (${t.horaInicio} hs)`}
                    >
                      <strong>{t.horaInicio}</strong> {t.clienteNombre.split(' ')[0]}
                      {totalTasks > 0 && (
                        <span style={{ fontSize: '0.6rem', opacity: 0.8, marginLeft: 'auto' }}>
                          ({tasksDone}/{totalTasks})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
