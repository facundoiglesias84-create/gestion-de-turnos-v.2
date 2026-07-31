import React from 'react';
import { AlertCircle, CheckCircle2, PlayCircle, X } from 'lucide-react';

export const ConfirmStatusModal = ({ isOpen, onClose, onConfirm, pendingStatusData }) => {
  if (!isOpen || !pendingStatusData) return null;

  const { turno, targetStatus } = pendingStatusData;

  const isConfirming = targetStatus === 'confirmado';
  const isFinalizing = targetStatus === 'finalizado';

  const actionText = isConfirming 
    ? 'CONFIRMAR EL TURNO' 
    : isFinalizing 
    ? 'FINALIZAR EL TURNO' 
    : `CAMBIAR A ${targetStatus.toUpperCase()}`;

  const iconColor = isConfirming ? 'var(--accent-cyan)' : 'var(--accent-emerald)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ fontSize: '1.15rem' }}>
            <AlertCircle size={22} style={{ color: iconColor }} />
            <span>Confirmación de Estado</span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '0.75rem 0 1.25rem' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: isConfirming ? 'rgba(6, 182, 212, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
            color: iconColor, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            {isConfirming ? <PlayCircle size={30} /> : <CheckCircle2 size={30} />}
          </div>

          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            ¿Deseas {actionText}?
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Turno de <strong style={{ color: 'var(--text-primary)' }}>{turno.clienteNombre}</strong> el <strong style={{ color: 'var(--text-primary)' }}>{turno.fecha} ({turno.horaInicio} hs)</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancelar
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={onConfirm}
            style={{ 
              flex: 1, 
              background: isFinalizing ? 'linear-gradient(135deg, #10b981, #059669)' : undefined 
            }}
          >
            {isConfirming ? <PlayCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>Sí, {isConfirming ? 'Confirmar' : isFinalizing ? 'Finalizar' : 'Aceptar'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
