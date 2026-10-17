import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TurnosListView } from './components/TurnosListView';
import { StatsOverview } from './components/StatsOverview';
import { TurnoModal } from './components/TurnoModal';
import { TurnoDetailModal } from './components/TurnoDetailModal';
import { XataConfigModal } from './components/XataConfigModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { RescheduleModal } from './components/RescheduleModal';
import { ReminderModal } from './components/ReminderModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';

import { getStoredTurnos, saveTurnos } from './services/storageService';
import { fetchTurnosFromXata, syncTurnoToXata, deleteTurnoFromXata, checkXataStatus } from './services/xataService';
import { todayAR } from './utils/dateAR';

export function App() {
  const todayStr = todayAR();

  const [turnos, setTurnos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [isNewTurnoOpen, setIsNewTurnoOpen] = useState(false);
  const [newTurnoDefaultDate, setNewTurnoDefaultDate] = useState(todayStr);

  const [selectedTurnoDetail, setSelectedTurnoDetail] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [turnoToDelete, setTurnoToDelete] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Modal de Reagendar turno
  const [rescheduleTurno, setRescheduleTurno] = useState(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

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

  const handleOpenReschedule = (turno) => {
    setRescheduleTurno(turno);
    setIsRescheduleOpen(true);
  };

  const handleRescheduleTurno = (turnoReagendado) => {
    handleUpdateTurno(turnoReagendado);
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
    return <LoadingSkeleton />;
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
        <StatsOverview turnos={turnos} />

        <TurnosListView 
          turnos={turnos}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onSelectTurno={handleSelectTurno}
          onDeleteTurno={handleRequestDelete}
          onOpenNewTurno={handleOpenNewTurno}
          onOpenReminder={handleOpenReminder}
          onOpenReschedule={handleOpenReschedule}
        />
      </main>


      <TurnoModal 
        isOpen={isNewTurnoOpen}
        onClose={() => setIsNewTurnoOpen(false)}
        onSave={handleCreateTurno}
        defaultDate={newTurnoDefaultDate}
        turnosExistentes={turnos}
      />

      <TurnoDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        turno={selectedTurnoDetail}
        onUpdateTurno={handleUpdateTurno}
        onOpenReminder={handleOpenReminder}
        onOpenReschedule={handleOpenReschedule}
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

      <RescheduleModal 
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        turno={rescheduleTurno}
        turnosExistentes={turnos}
        onReschedule={handleRescheduleTurno}
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
