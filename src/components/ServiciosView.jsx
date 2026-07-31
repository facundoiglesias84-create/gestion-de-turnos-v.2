import React, { useState } from 'react';
import { Tag, Plus, Trash2, DollarSign, FileText } from 'lucide-react';

export const ServiciosView = ({ servicios, onAddServicio, onDeleteServicio }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioBase, setPrecioBase] = useState('');

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
              onClick={() => onDeleteServicio(s.id)}
              title="Eliminar servicio"
              style={{ width: '38px', height: '38px' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
