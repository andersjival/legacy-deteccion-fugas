import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { KPICards } from './KPICards';
import { AppointmentCard } from './AppointmentCard';
import { PhotoLightbox } from './PhotoLightbox';
import { AvailabilityManager } from './AvailabilityManager';
import { StorageManager } from './StorageManager';
import { useAppointments } from '../../hooks/useAppointments';
import { getTodayDateString, getTomorrowDateString } from '../../utils/dateFormatter';
import { Bell, AlertCircle, X, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';

interface AdminViewProps {
  onClose: () => void;
  onLogout: () => void;
  onInstallPWA?: () => void;
  onRequestNotifications?: () => void;
  isInstallable?: boolean;
  notificationsGranted?: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onClose,
  onLogout,
  onInstallPWA,
  onRequestNotifications,
  isInstallable = false,
  notificationsGranted = false
}) => {
  const {
    appointments,
    loading,
    lastUpdated,
    newAppointmentAlert,
    dismissAlert,
    refresh,
    updateStatus
  } = useAppointments(true);

  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'all' | 'availability' | 'storage'>('today');
  const [lightboxState, setLightboxState] = useState<{ photos: string[]; index: number } | null>(null);

  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  const todayAppointments = appointments.filter((a) => a.appointment_date === todayStr);
  const tomorrowAppointments = appointments.filter((a) => a.appointment_date === tomorrowStr);

  const openLightbox = (photos: string[], index: number) => {
    setLightboxState({ photos, index });
  };

  const closeLightbox = () => setLightboxState(null);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col overflow-y-auto">
      {/* Header Fijo */}
      <AdminHeader
        onRefresh={refresh}
        onLogout={onLogout}
        onClose={onClose}
        onInstallPWA={onInstallPWA}
        onRequestNotifications={onRequestNotifications}
        isInstallable={isInstallable}
        notificationsGranted={notificationsGranted}
        lastUpdated={lastUpdated}
      />

      {/* Toast Alert en Vivo si llega nueva cita */}
      {newAppointmentAlert && (
        <div className="bg-brand-orange text-white px-4 py-3 shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <Bell className="w-5 h-5 shrink-0" />
            <span>¡NUEVA CITA RECIBIDA! Cliente: {newAppointmentAlert.client_name} ({newAppointmentAlert.appointment_date})</span>
          </div>
          <button onClick={dismissAlert} className="p-1 hover:bg-black/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Contenido Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* KPIs */}
        <KPICards appointments={appointments} />

        {/* Pestañas de Navegación */}
        <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'today' ? 'bg-brand-blue text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Hoy ({todayAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tomorrow')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'tomorrow' ? 'bg-brand-blue text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Mañana ({tomorrowAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'all' ? 'bg-brand-blue text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Todas las Citas ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'availability' ? 'bg-brand-dark text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <span>Disponibilidad & Horarios</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'storage' ? 'bg-brand-dark text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Limpieza R2/D1</span>
          </button>
        </div>

        {/* Renderizado de Vistas según Pestaña */}
        {activeTab === 'availability' && <AvailabilityManager />}
        {activeTab === 'storage' && <StorageManager />}

        {(activeTab === 'today' || activeTab === 'tomorrow' || activeTab === 'all') && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-sm text-brand-blue font-bold">Cargando citas...</div>
            ) : (
              (() => {
                const list =
                  activeTab === 'today'
                    ? todayAppointments
                    : activeTab === 'tomorrow'
                    ? tomorrowAppointments
                    : appointments;

                if (list.length === 0) {
                  return (
                    <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
                      <p className="text-base font-extrabold text-brand-dark">No hay citas para mostrar en esta vista</p>
                      <p className="text-xs text-slate-500">Las nuevas reservas de clientes aparecerán aquí automáticamente.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {list.map((app) => (
                      <AppointmentCard
                        key={app.id}
                        appointment={app}
                        onUpdateStatus={updateStatus}
                        onOpenLightbox={openLightbox}
                      />
                    ))}
                  </div>
                );
              })()
            )}
          </div>
        )}

      </main>

      {/* Lightbox de Fotos */}
      {lightboxState && (
        <PhotoLightbox
          photos={lightboxState.photos}
          currentIndex={lightboxState.index}
          onClose={closeLightbox}
          onPrev={() =>
            setLightboxState((prev) =>
              prev
                ? { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length }
                : null
            )
          }
          onNext={() =>
            setLightboxState((prev) =>
              prev ? { ...prev, index: (prev.index + 1) % prev.photos.length } : null
            )
          }
        />
      )}
    </div>
  );
};
