import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { CalendarView } from './components/CalendarView';
import { TurnosListView } from './components/TurnosListView';
import { TareasPredefinidasView } from './components/TareasPredefinidasView';
import { StatsOverview } from './components/StatsOverview';
import { TurnoModal } from './components/TurnoModal';
import { TurnoDetailModal } from './components/TurnoDetailModal';
import { XataConfigModal } from './components/XataConfigModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { ConfirmStatusModal } from './components/ConfirmStatusModal';
import { ReminderModal } from './components/ReminderModal';

import { getStoredTurnos, saveTurnos, getStoredTareasPredefinidas, saveTareasPredefinidas } from './services/storageService';
import { fetchTurnosFromXata, syncTurnoToXata, deleteTurnoFromXata, checkXataStatus } from './services/xataService';

export function App() {
  const todayStr = new Date().toISOString().split('T')[0];

  const [turnos, setTurnos] = useState([]);
  const [tareasPredefinidas, setTareasPredefinidas] = useState(() => getStoredTareasPredefinidas());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState('calendar');

  const [isNewTurnoOpen, setIsNewTurnoOpen] = useState(false);
  const [newTurnoDefaultDate, setNewTurnoDefaultDate] = useState(todayStr);

  const [selectedTurnoDetail, setSelectedTurnoDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [turnoToDelete, setTurnoToDelete] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Doble confirmación para cambio de estado
  const [pendingStatusData, setPendingStatusData] = useState(null);
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);

  const [reminderTurno, setReminderTurno] = useState(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const [xataConnected, setXataConnected] = useState(false);
  const [isXataConfigOpen, setIsXataConfigOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const status = await checkXataStatus();
      setXataConnected(status.connected);

      if (status.connected) {
        const res = await fetchTurnosFromXata();
        if (res.success && res.data.length > 0) {
          setTurnos(res.data);
          saveTurnos(res.data);
        } else {
          const localTurnos = getStoredTurnos();
          setTurnos(localTurnos);
          localTurnos.forEach(t => syncTurnoToXata(t));
        }
      } else {
        setTurnos(getStoredTurnos());
      }
      setIsLoading(false);
    };
    initData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveTurnos(turnos);
    }
  }, [turnos, isLoading]);

  useEffect(() => {
    saveTareasPredefinidas(tareasPredefinidas);
  }, [tareasPredefinidas]);

  const handleAddTareaPreset = (nuevaTarea) => {
    setTareasPredefinidas([...tareasPredefinidas, nuevaTarea]);
  };

  const handleUpdateTareaPreset = (tareaActualizada) => {
    setTareasPredefinidas(tareasPredefinidas.map((t) => (t.id === tareaActualizada.id ? tareaActualizada : t)));
  };

  const handleDeleteTareaPreset = (id) => {
    setTareasPredefinidas(tareasPredefinidas.filter(t => t.id !== id));
  };

  const handleCreateTurno = async (nuevoTurno) => {
    const updated = [nuevoTurno, ...turnos];
    setTurnos(updated);

    if (xataConnected) {
      await syncTurnoToXata(nuevoTurno);
    }
  };

  const handleUpdateTurno = async (turnoActualizado) => {
    const updated = turnos.map((t) => (t.id === turnoActualizado.id ? turnoActualizado : t));
    setTurnos(updated);
    if (selectedTurnoDetail && selectedTurnoDetail.id === turnoActualizado.id) {
      setSelectedTurnoDetail(turnoActualizado);
    }

    if (xataConnected) {
      await syncTurnoToXata(turnoActualizado);
    }
  };

  const handleRequestStatusChange = (turno, targetStatus) => {
    setPendingStatusData({ turno, targetStatus });
    setIsConfirmStatusOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (!pendingStatusData) return;
    const { turno, targetStatus } = pendingStatusData;
    handleUpdateTurno({ ...turno, estado: targetStatus });
    setIsConfirmStatusOpen(false);
    setPendingStatusData(null);
  };

  const handleRequestDelete = (id) => {
    const target = turnos.find((t) => t.id === id);
    if (target) {
      setTurnoToDelete(target);
      setIsConfirmDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!turnoToDelete) return;
    const id = turnoToDelete.id;
    const updated = turnos.filter((t) => t.id !== id);
    setTurnos(updated);

    if (selectedTurnoDetail?.id === id) {
      setIsDetailOpen(false);
      setSelectedTurnoDetail(null);
    }

    setIsConfirmDeleteOpen(false);
    setTurnoToDelete(null);

    if (xataConnected) {
      await deleteTurnoFromXata(id);
    }
  };

  const handleOpenReminder = (turno) => {
    setReminderTurno(turno);
    setIsReminderOpen(true);
  };

  const handleOpenNewTurno = (dateParam) => {
    setNewTurnoDefaultDate(dateParam || selectedDate || todayStr);
    setIsNewTurnoOpen(true);
  };

  const handleSelectTurno = (turno) => {
    setSelectedTurnoDetail(turno);
    setIsDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--accent-cyan)' }}>
        <h2>Cargando Turnos...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header 
        onOpenNewTurno={handleOpenNewTurno}
        onOpenXataConfig={() => setIsXataConfigOpen(true)}
        xataConnected={xataConnected}
        activeDate={selectedDate}
      />

      <main className="main-content">
        <StatsOverview turnos={turnos} selectedDate={selectedDate} />

        <div className="desktop-only" style={{ marginBottom: '1.25rem' }}>
          <div className="nav-tabs" style={{ width: 'fit-content' }}>
            <button 
              className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              Calendario & Fecha Actual
            </button>

            <button 
              className={`tab-btn ${activeTab === 'turnos' ? 'active' : ''}`}
              onClick={() => setActiveTab('turnos')}
            >
              Lista de Turnos ({turnos.length})
            </button>

            <button 
              className={`tab-btn ${activeTab === 'tareas' ? 'active' : ''}`}
              onClick={() => setActiveTab('tareas')}
            >
              Catálogo de Tareas ({tareasPredefinidas.length})
            </button>
          </div>
        </div>

        {activeTab === 'calendar' && (
          <CalendarView 
            turnos={turnos}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onOpenNewTurno={handleOpenNewTurno}
            onSelectTurno={handleSelectTurno}
          />
        )}

        {activeTab === 'tareas' && (
          <TareasPredefinidasView 
            tareasPredefinidas={tareasPredefinidas}
            onAddTareaPreset={handleAddTareaPreset}
            onUpdateTareaPreset={handleUpdateTareaPreset}
            onDeleteTareaPreset={handleDeleteTareaPreset}
          />
        )}

        {(activeTab === 'turnos' || activeTab === 'calendar' || activeTab === 'stats') && (
          <TurnosListView 
            turnos={turnos}
            selectedDate={selectedDate}
            onSelectTurno={handleSelectTurno}
            onDeleteTurno={handleRequestDelete}
            onOpenNewTurno={handleOpenNewTurno}
            onOpenReminder={handleOpenReminder}
            onRequestStatusChange={handleRequestStatusChange}
          />
        )}
      </main>

      <MobileNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTurno={handleOpenNewTurno}
      />

      <TurnoModal 
        isOpen={isNewTurnoOpen}
        onClose={() => setIsNewTurnoOpen(false)}
        onSave={handleCreateTurno}
        defaultDate={newTurnoDefaultDate}
        turnosExistentes={turnos}
        tareasPredefinidas={tareasPredefinidas}
      />

      <TurnoDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        turno={selectedTurnoDetail}
        onUpdateTurno={handleUpdateTurno}
        onOpenReminder={handleOpenReminder}
        tareasPredefinidas={tareasPredefinidas}
        onRequestStatusChange={handleRequestStatusChange}
      />

      <XataConfigModal 
        isOpen={isXataConfigOpen}
        onClose={() => setIsXataConfigOpen(false)}
        xataConnected={xataConnected}
      />

      <ConfirmDeleteModal 
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        turno={turnoToDelete}
      />

      <ConfirmStatusModal 
        isOpen={isConfirmStatusOpen}
        onClose={() => setIsConfirmStatusOpen(false)}
        onConfirm={handleConfirmStatusChange}
        pendingStatusData={pendingStatusData}
      />

      <ReminderModal 
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        turno={reminderTurno}
      />
    </div>
  );
}

export default App;
