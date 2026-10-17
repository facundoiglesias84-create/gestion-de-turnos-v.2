import React from 'react';

// Campo con un cuadrado de ícono a la izquierda y una línea animada al enfocar.
export const IconField = ({ icon: Icon, multiline = false, children }) => (
  <div className={`icon-field ${multiline ? 'icon-field-multiline' : ''}`}>
    <span className="icon-field-tile" aria-hidden="true">
      <Icon size={18} />
    </span>
    {children}
  </div>
);
