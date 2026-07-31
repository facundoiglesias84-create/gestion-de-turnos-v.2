import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, turno }) => {
  if (!isOpen || !turno) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem' }}>
          <div 
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'rgba(244, 63, 94, 0.15)', 
              color: '#f43f5e', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}
          >
            <AlertTriangle size={28} />
          </div>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            ¿Eliminar este turno?
          </h3>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Estás a punto de borrar el turno de <strong style={{ color: 'var(--text-primary)' }}>{turno.clienteNombre}</strong> ({turno.servicio}) programado para el <strong style={{ color: 'var(--text-primary)' }}>{turno.fecha}</strong>.
          </p>

          <span style={{ fontSize: '0.775rem', color: '#fda4af', background: 'rgba(244, 63, 94, 0.1)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            Esta acción eliminará el turno también de Xata.io.
          </span>

          <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={onConfirm} style={{ flex: 1, gap: '0.4rem' }}>
              <Trash2 size={16} />
              <span>Sí, Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
