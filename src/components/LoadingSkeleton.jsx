import React from 'react';

// Pantalla de carga con la misma forma que la vista principal.
export const LoadingSkeleton = () => (
  <div className="app-container" aria-busy="true" aria-live="polite">
    <span className="sr-only">Cargando turnos…</span>

    <header className="app-header">
      <div className="header-content">
        <div className="logo-area">
          <div className="skeleton" style={{ width: 96, height: 22 }} />
          <div className="skeleton" style={{ width: 130, height: 14, marginTop: 6 }} />
        </div>
        <div className="skeleton" style={{ width: 150, height: 48, borderRadius: 9999 }} />
      </div>
    </header>

    <main className="main-content" aria-hidden="true">
      <div className="greeting" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div className="skeleton" style={{ width: 200, height: 28 }} />
        <div className="skeleton" style={{ width: 150, height: 16 }} />
      </div>

      <div className="stats-grid">
        {[0, 1, 2].map((i) => (
          <div key={i} className="glass-panel stat-card">
            <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10 }} />
            <div className="skeleton" style={{ width: 32, height: 26 }} />
            <div className="skeleton" style={{ width: 70, height: 14 }} />
          </div>
        ))}
      </div>

      <div className="glass-nav-wrap">
        <div className="skeleton" style={{ width: 'min(100%, 380px)', height: 56, borderRadius: 9999 }} />
      </div>

      <div className="glass-panel" style={{ padding: '1.1rem', marginBottom: '1.75rem' }}>
        <div className="skeleton" style={{ width: 90, height: 18, marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {[64, 64, 84, 130].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: w, height: 44, borderRadius: 9999 }} />
          ))}
        </div>
        <div className="skeleton" style={{ width: '100%', height: 54, borderRadius: 18 }} />
      </div>

      <div className="turnos-grid">
        {[0, 1].map((i) => (
          <div key={i} className="glass-panel turno-card">
            <div className="turno-top">
              <div className="skeleton" style={{ width: 68, height: 56, borderRadius: 14 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton" style={{ width: '70%', height: 18 }} />
                <div className="skeleton" style={{ width: '50%', height: 14 }} />
              </div>
            </div>
            <div className="skeleton" style={{ width: '100%', height: 42, borderRadius: 14 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="skeleton" style={{ flex: 1, height: 44, borderRadius: 14 }} />
              <div className="skeleton" style={{ flex: 1, height: 44, borderRadius: 14 }} />
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 14 }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
);
