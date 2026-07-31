import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Server } from 'lucide-react';
import { checkXataStatus } from '../services/xataService';

export const XataConfigModal = ({ isOpen, onClose, xataConnected }) => {
  // Las llamadas a Hooks SIEMPRE deben ejecutarse antes de cualquier 'return' condicional
  const [statusInfo, setStatusInfo] = useState({ connected: xataConnected, db: 'Xata.io PostgreSQL' });
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setChecking(true);
      checkXataStatus().then((info) => {
        if (isMounted) {
          setStatusInfo(info);
          setChecking(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen]);

  const handleRefreshStatus = async () => {
    setChecking(true);
    const info = await checkXataStatus();
    setStatusInfo(info);
    setChecking(false);
  };

  // Return condicional DESPUÉS de todos los hooks
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Database style={{ color: 'var(--accent-cyan)' }} size={22} />
            <h2>Conexión Base de Datos Xata.io</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar modal">
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '0.5rem 0' }}>
          <div 
            style={{ 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: statusInfo.connected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${statusInfo.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}
          >
            {statusInfo.connected ? (
              <CheckCircle2 size={24} style={{ color: '#34d399', flexShrink: 0 }} />
            ) : (
              <AlertCircle size={24} style={{ color: '#fbbf24', flexShrink: 0 }} />
            )}
            <div>
              <h4 style={{ color: statusInfo.connected ? '#34d399' : '#fbbf24', fontSize: '1rem', marginBottom: '0.15rem' }}>
                {statusInfo.connected ? 'Conectado a Xata.io (PostgreSQL)' : 'Modo Almacenamiento Local'}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {statusInfo.connected 
                  ? 'La aplicación se encuentra conectada a tu base de datos Xata en us-east-1.'
                  : 'No se pudo conectar a Xata.io. Los datos se están guardando localmente.'}
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Server size={16} /> Detalles de la Configuración Activa
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              <div><strong>Host Xata:</strong> <code>lotafuq8s17fjckvferrcqtmk8.us-east-1.xata.tech</code></div>
              <div><strong>Base de Datos:</strong> <code>xata</code></div>
              <div><strong>Tabla Principal:</strong> <code>turnos</code> (id, cliente_nombre, fecha, hora, servicio, tareas_json)</div>
              <div><strong>Registros en Xata:</strong> {statusInfo.count !== undefined ? statusInfo.count : 'Verificando...'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={handleRefreshStatus} disabled={checking}>
              <RefreshCw size={16} className={checking ? 'spin' : ''} />
              <span>{checking ? 'Comprobando...' : 'Comprobar Conexión'}</span>
            </button>

            <button className="btn btn-primary" onClick={onClose}>
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
