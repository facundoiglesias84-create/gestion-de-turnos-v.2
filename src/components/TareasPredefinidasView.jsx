import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, DollarSign, AlertTriangle, X } from 'lucide-react';

export const TareasPredefinidasView = ({ tareasPredefinidas, onAddTareaPreset, onDeleteTareaPreset }) => {
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const [tareaToDelete, setTareaToDelete] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    const nuevaTarea = {
      id: 'tp-' + Date.now(),
      descripcion: descripcion.trim(),
      precio: parseFloat(precio) || 0
    };

    onAddTareaPreset(nuevaTarea);
    setDescripcion('');
    setPrecio('');
  };

  const handleConfirmDelete = () => {
    if (tareaToDelete) {
      onDeleteTareaPreset(tareaToDelete.id);
      setTareaToDelete(null);
    }
  };

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <CheckSquare size={22} style={{ color: 'var(--accent-cyan)' }} />
          <h2>Catálogo de Tareas Predefinidas</h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Crea un catálogo de tareas frecuentes con sus precios para cargarlas rápidamente desde un menú desplegable al agendar o gestionar turnos.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Descripción de la Tarea *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ej: Cambio de aceite y filtro"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Precio Estimado ($)</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="Ej: 15000"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
            <Plus size={18} />
            <span>Agregar al Catálogo</span>
          </button>
        </form>
      </div>

      {/* Lista de Tareas Predefinidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {tareasPredefinidas.map((tp) => (
          <div key={tp.id} className="glass-panel" style={{ padding: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.025rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {tp.descripcion}
              </h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <DollarSign size={15} /> ${tp.precio ? tp.precio.toLocaleString('es-AR') : 0}
              </div>
            </div>

            <button 
              className="btn btn-danger btn-icon" 
              onClick={() => setTareaToDelete(tp)}
              title="Eliminar del catálogo"
              style={{ width: '38px', height: '38px' }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {tareaToDelete && (
        <div className="modal-overlay" onClick={() => setTareaToDelete(null)}>
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="close-btn" onClick={() => setTareaToDelete(null)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '-0.5rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={26} />
              </div>

              <h3 style={{ fontSize: '1.15rem' }}>¿Eliminar del catálogo?</h3>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                ¿Estás seguro de que deseas eliminar <strong style={{ color: 'var(--text-primary)' }}>"{tareaToDelete.descripcion}"</strong> del catálogo?
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={() => setTareaToDelete(null)} style={{ flex: 1 }}>
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
