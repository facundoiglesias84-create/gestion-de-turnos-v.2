import React, { useState } from 'react';
import { Tag, Plus, Trash2, DollarSign, FileText, AlertTriangle, X } from 'lucide-react';

export const ServiciosView = ({ servicios, onAddServicio, onDeleteServicio }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioBase, setPrecioBase] = useState('');

  // Estado para el modal de confirmación de borrado de servicio
  const [servicioToDelete, setServicioToDelete] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const nuevoServicio = {
      id: 's-' + Date.now(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precioBase: parseFloat(precioBase) || 0
    };

    onAddServicio(nuevoServicio);
    setNombre('');
    setDescripcion('');
    setPrecioBase('');
  };

  const handleConfirmDelete = () => {
    if (servicioToDelete) {
      onDeleteServicio(servicioToDelete.id);
      setServicioToDelete(null);
    }
  };

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Tag size={22} style={{ color: 'var(--accent-cyan)' }} />
          <h2>Gestión de Servicios & Categorías</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Nombre del Servicio *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: Mantenimiento Completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Descripción</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: Incluye escaneo e insumos"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Precio Estimado ($)</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="Ej: 25000"
              value={precioBase}
              onChange={(e) => setPrecioBase(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
            <Plus size={18} />
            <span>Agregar Servicio</span>
          </button>
        </form>
      </div>

      {/* Lista de Servicios */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {servicios.map((s) => (
          <div key={s.id} className="glass-panel" style={{ padding: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {s.nombre}
              </h3>
              {s.descripcion && (
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <FileText size={13} /> {s.descripcion}
                </div>
              )}
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <DollarSign size={15} /> ${s.precioBase ? s.precioBase.toLocaleString('es-AR') : 0}
              </div>
            </div>

            <button 
              className="btn btn-danger btn-icon" 
              onClick={() => setServicioToDelete(s)}
              title="Eliminar servicio"
              style={{ width: '38px', height: '38px' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Confirmación de Eliminación de Servicio */}
      {servicioToDelete && (
        <div className="modal-overlay" onClick={() => setServicioToDelete(null)}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="close-btn" onClick={() => setServicioToDelete(null)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={26} />
              </div>

              <h3 style={{ fontSize: '1.15rem' }}>¿Eliminar este servicio?</h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                ¿Estás seguro de que deseas eliminar la categoría <strong style={{ color: 'var(--text-primary)' }}>"{servicioToDelete.nombre}"</strong>?
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setServicioToDelete(null)} style={{ flex: 1 }}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleConfirmDelete} style={{ flex: 1 }}>
                  <Trash2 size={15} />
                  <span>Sí, Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
