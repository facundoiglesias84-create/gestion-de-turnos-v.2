import React from 'react';
import { CalendarCheck, Clock, CheckCircle2 } from 'lucide-react';
import { todayAR, hourAR, weekdayOf } from '../utils/dateAR';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const getSaludo = (hora) => {
  if (hora < 12) return 'Buen día';
  if (hora < 20) return 'Buenas tardes';
  return 'Buenas noches';
};

export const StatsOverview = ({ turnos }) => {
  const todayStr = todayAR();

  const turnosHoy = turnos.filter((t) => t.fecha === todayStr).length;
  const turnosProximos = turnos.filter((t) => t.fecha >= todayStr).length;
  const turnosPasados = turnos.filter((t) => t.fecha < todayStr).length;

  const [, mes, diaMes] = todayStr.split('-').map(Number);
  const dia = DIAS[weekdayOf(todayStr)];
  const fechaTexto = `${dia.charAt(0).toUpperCase() + dia.slice(1)} ${diaMes} de ${MESES[mes - 1]}`;

  return (
    <>
      <div className="greeting">
        <h2>{getSaludo(hourAR())}</h2>
        <p>{fechaTexto}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card lavender">
          <div className="stat-icon" style={{ color: 'var(--primary)' }}>
            <CalendarCheck size={20} aria-hidden="true" />
          </div>
          <div className="stat-value">{turnosHoy}</div>
          <div className="stat-label">Hoy</div>
        </div>

        <div className="stat-card peach">
          <div className="stat-icon" style={{ color: 'var(--warning-text)' }}>
            <Clock size={20} aria-hidden="true" />
          </div>
          <div className="stat-value">{turnosProximos}</div>
          <div className="stat-label">Próximos</div>
        </div>

        <div className="stat-card mint">
          <div className="stat-icon" style={{ color: 'var(--success-text)' }}>
            <CheckCircle2 size={20} aria-hidden="true" />
          </div>
          <div className="stat-value">{turnosPasados}</div>
          <div className="stat-label">Realizados</div>
        </div>
      </div>
    </>
  );
};
