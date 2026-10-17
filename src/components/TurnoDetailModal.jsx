import React, { useState, useEffect } from 'react';
import { X, Clock, Phone, CalendarClock, Edit3, Check, Wrench, DollarSign, StickyNote, User, Trash2, CheckCircle2, MessageCircle } from 'lucide-react';
import { todayAR, weekdayOf } from '../utils/dateAR';
import { IconField } from './IconField';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const formatLongDate = (dateStr) => {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-').map(Number);
  return `${DIAS[weekdayOf(dateStr)]} ${d} de ${MESES[m - 1]}`;
};

// Para WhatsApp: solo dígitos; si es un celular argentino sin código de país, se le agrega 549
const toWhatsappNumber = (tel) => {
  const digits = (tel || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('54')) return digits;
  return `549${digits.replace(/^0/, '')}`;
};

export const TurnoDetailModal = ({ turno, isOpen, onClose, onUpdateTurno, onOpenReschedule, onDeleteTurno }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [servicio, setServicio] = useState('');
  const [precio, setPrecio] = useState('');
  const [notas, setNotas] = useState('');

  const getPrecio = (t) => (t?.tareas || []).reduce((acc, tk) => acc + (tk.precio || 0), 0);

  const resetForm = () => {
    if (!turno) return;
    setClienteNombre(turno.clienteNombre || '');
    setClienteTelefono(turno.clienteTelefono || '');
    setServicio(turno.servicio || '');
    const total = getPrecio(turno);
    setPrecio(total > 0 ? total.toString() : '');
    setNotas(turno.notas || '');
  };

  useEffect(() => {
    resetForm();
    setIsEditing(false);
  }, [turno, isOpen]);

  if (!isOpen || !turno) return null;

  const todayStr = todayAR();
  const isPast = turno.fecha < todayStr;
  const isToday = turno.fecha === todayStr;
  const total = getPrecio(turno);

  const handleSave = (e) => {
    e.preventDefault();
    const parsedPrecio = precio ? parseFloat(precio) : 0;

    const turnoActualizado = {
      ...turno,
      clienteNombre: clienteNombre.trim(),
      clienteTelefono: clienteTelefono.trim(),
      servicio: servicio.trim() || 'Turno de Servicio',
      notas: notas.trim(),
      tareas: [{ id: 'tk-main', descripcion: servicio.trim(), precio: parsedPrecio, completada: isPast }]
    };

    onUpdateTurno(turnoActualizado);
    setIsEditing(false);
  };

  const badge = isPast
    ? { text: 'Realizado', cls: 'badge-completado' }
    : isToday
      ? { text: 'Hoy', cls: 'badge-confirmado' }
      : { text: 'Próximo', cls: 'badge-pendiente' };

  const whatsapp = toWhatsappNumber(turno.clienteTelefono);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ minWidth: 0 }}>
            <span className={`badge ${badge.cls}`} style={{ marginBottom: '0.4rem' }}>{badge.text}</span>
            <h2 className="modal-title" style={{ overflowWrap: 'anywhere' }}>
              {isEditing ? (isPast ? 'Corregir turno' : 'Editar turno') : turno.clienteNombre}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {!isEditing ? (
          <>
            {isPast && (
              <div className="detail-past-note">
                <CheckCircle2 size={20} aria-hidden="true" />
                <span>Este turno ya pasó. Se muestra solo para consulta.</span>
              </div>
            )}

            <div className="detail-rows">
              <div className="detail-row">
                <span className="detail-row-icon"><Clock size={18} aria-hidden="true" /></span>
                <div>
                  <span className="detail-row-label">Fecha y hora</span>
                  <span className="detail-row-value">
                    {formatLongDate(turno.fecha)} · {turno.horaInicio ? `${turno.horaInicio} hs` : 'Sin hora'}
                  </span>
                </div>
              </div>

              {turno.servicio && (
                <div className="detail-row">
                  <span className="detail-row-icon"><Wrench size={18} aria-hidden="true" /></span>
                  <div>
                    <span className="detail-row-label">Servicio</span>
                    <span className="detail-row-value">{turno.servicio}</span>
                  </div>
                </div>
              )}

              {total > 0 && (
                <div className="detail-row">
                  <span className="detail-row-icon"><DollarSign size={18} aria-hidden="true" /></span>
                  <div>
                    <span className="detail-row-label">Monto</span>
                    <span className="detail-row-value" style={{ color: 'var(--success-text)' }}>
                      ${total.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              )}

              {turno.clienteTelefono && (
                <div className="detail-row">
                  <span className="detail-row-icon"><Phone size={18} aria-hidden="true" /></span>
                  <div style={{ minWidth: 0 }}>
                    <span className="detail-row-label">Teléfono</span>
                    <span className="detail-row-value">{turno.clienteTelefono}</span>
                    <div className="detail-contact">
                      <a className="btn btn-secondary" href={`tel:${turno.clienteTelefono}`}>
                        <Phone size={16} aria-hidden="true" /> Llamar
                      </a>
                      {whatsapp && (
                        <a className="btn btn-secondary" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
                          <MessageCircle size={16} aria-hidden="true" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {turno.notas && (
                <div className="detail-row">
                  <span className="detail-row-icon"><StickyNote size={18} aria-hidden="true" /></span>
                  <div>
                    <span className="detail-row-label">Notas</span>
                    <span className="detail-row-value" style={{ fontWeight: 500 }}>{turno.notas}</span>
                  </div>
                </div>
              )}
            </div>

            {isPast ? (
              <div style={{ textAlign: 'center' }}>
                <button type="button" className="link-btn" onClick={() => setIsEditing(true)}>
                  ¿Hay un error? Corregir datos
                </button>
              </div>
            ) : (
              <div className="detail-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    onClose();
                    if (onOpenReschedule) onOpenReschedule(turno);
                  }}
                >
                  <CalendarClock size={18} style={{ color: 'var(--primary)' }} aria-hidden="true" />
                  Reagendar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  <Edit3 size={18} aria-hidden="true" />
                  Editar
                </button>
                <button type="button" className="btn btn-danger" onClick={() => onDeleteTurno && onDeleteTurno(turno.id)}>
                  <Trash2 size={18} aria-hidden="true" />
                  Eliminar turno
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Cliente *</label>
              <IconField icon={User}>
                <input type="text" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} required />
              </IconField>
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <IconField icon={Phone}>
                <input type="tel" value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} />
              </IconField>
            </div>

            <div className="form-group">
              <label>Servicio *</label>
              <IconField icon={Wrench}>
                <input type="text" value={servicio} onChange={(e) => setServicio(e.target.value)} required />
              </IconField>
            </div>

            <div className="form-group">
              <label>Monto ($)</label>
              <IconField icon={DollarSign}>
                <input type="number" placeholder="Ej: 25000" value={precio} onChange={(e) => setPrecio(e.target.value)} />
              </IconField>
            </div>

            <div className="form-group">
              <label>Notas</label>
              <IconField icon={StickyNote} multiline>
                <textarea value={notas} onChange={(e) => setNotas(e.target.value)}></textarea>
              </IconField>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { resetForm(); setIsEditing(false); }}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Check size={18} aria-hidden="true" />
                Guardar
              </button>
            </div>

            {isPast && (
              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  className="link-btn"
                  style={{ color: 'var(--danger-text)' }}
                  onClick={() => onDeleteTurno && onDeleteTurno(turno.id)}
                >
                  Eliminar este turno
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
