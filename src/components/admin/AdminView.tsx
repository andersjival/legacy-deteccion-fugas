import React, { useState } from 'react';
import { AdminBottomNav, AdminTab } from './AdminBottomNav';
import { TodayRouteCard } from './TodayRouteCard';
import { AppointmentCard } from './AppointmentCard';
import { PhotoLightbox } from './PhotoLightbox';
import { AvailabilityManager } from './AvailabilityManager';
import { AdminSettingsTab } from './AdminSettingsTab';
import { useAppointments } from '../../hooks/useAppointments';
import { getTodayDateString, getTomorrowDateString } from '../../utils/dateFormatter';
import { Bell, RefreshCw, X, Sparkles, Navigation } from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState<AdminTab>('route');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'tomorrow'>('all');
  const [lightboxState, setLightboxState] = useState<{ photos: string[]; index: number } | null>(null);

  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  const todayAppointments = appointments.filter((a) => a.appointment_date === todayStr);
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === 'pending') return a.status === 'pending';
    if (filterStatus === 'confirmed') return a.status === 'confirmed';
    if (filterStatus === 'tomorrow') return a.appointment_date === tomorrowStr;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#F1F5F9] flex flex-col overflow-hidden text-brand-dark font-sans select-none">
      
      {/* Top Mobile App Header */}
      <header className="bg-brand-dark text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-sm">
            <img src="/logo.png" alt="Logo Legacy" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none">Legacy Panel</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">En Vivo</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={refresh}
            title="Refrescar"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Salir"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Alerta flotante en tiempo real si entra una nueva cita */}
      {newAppointmentAlert && (
        <div className="bg-brand-orange text-white px-4 py-3 shadow-lg flex items-center justify-between animate-bounce shrink-0">
          <div className="flex items-center gap-2 text-xs font-black">
            <Bell className="w-4 h-4 shrink-0" />
            <span>¡NUEVA CITA! {newAppointmentAlert.client_name} ({newAppointmentAlert.appointment_date})</span>
          </div>
          <button onClick={dismissAlert} className="p-1 hover:bg-black/20 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Área de Contenido con Scroll Móvil */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28 max-w-lg w-full mx-auto space-y-4">
        
        {/* TAB 1: RUTA DE HOY (Modo Calle) */}
        {activeTab === 'route' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-base font-black text-brand-dark">Plan de Ruta de Hoy</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {todayAppointments.length} trabajos agendados para hoy
                </p>
              </div>
              <span className="text-xs font-black text-brand-blue bg-brand-ice px-3 py-1 rounded-xl border border-brand-iceBorder">
                HOY
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs font-bold text-brand-blue">Cargando ruta de hoy...</div>
            ) : todayAppointments.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-ice text-brand-blue flex items-center justify-center mx-auto">
                  <Navigation className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-brand-dark">Sin trabajos pendientes hoy</h4>
                <p className="text-xs text-slate-500">
                  Las nuevas citas para hoy se organizarán automáticamente en este plan de ruta.
                </p>
              </div>
            ) : (
              todayAppointments.map((app, idx) => (
                <TodayRouteCard
                  key={app.id}
                  appointment={app}
                  index={idx}
                  onUpdateStatus={updateStatus}
                  onOpenLightbox={(photos, index) => setLightboxState({ photos, index })}
                />
              ))
            )}
          </div>
        )}

        {/* TAB 2: TODAS LAS CITAS CON FILTROS RÁPIDOS */}
        {activeTab === 'all' && (
          <div className="space-y-3">
            {/* Filtros Rápidos Estilo Pastilla */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
              {[
                { id: 'all', label: `Todas (${appointments.length})` },
                { id: 'pending', label: `Pendientes (${pendingAppointments.length})` },
                { id: 'confirmed', label: 'Confirmadas' },
                { id: 'tomorrow', label: 'Mañana' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterStatus(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl flex-shrink-0 transition-all ${
                    filterStatus === f.id
                      ? 'bg-brand-blue text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-12 text-xs font-bold text-brand-blue">Cargando citas...</div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
                No hay citas en este filtro.
              </div>
            ) : (
              filteredAppointments.map((app) => (
                <AppointmentCard
                  key={app.id}
                  appointment={app}
                  onUpdateStatus={updateStatus}
                  onOpenLightbox={(photos, index) => setLightboxState({ photos, index })}
                />
              ))
            )}
          </div>
        )}

        {/* TAB 3: HORARIOS Y "MAÑANA VOY A TRABAJAR" */}
        {activeTab === 'schedule' && <AvailabilityManager />}

        {/* TAB 4: AJUSTES, PWA Y LIMPIEZA */}
        {activeTab === 'settings' && (
          <AdminSettingsTab
            onLogout={onLogout}
            onInstallPWA={onInstallPWA}
            onRequestNotifications={onRequestNotifications}
            isInstallable={isInstallable}
            notificationsGranted={notificationsGranted}
          />
        )}

      </main>

      {/* BARRA INFERIOR DE NAVEGACIÓN MÓVIL ESTILO APP NATIVA */}
      <AdminBottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        todayCount={todayAppointments.length}
        pendingCount={pendingAppointments.length}
      />

      {/* Visor de Fotos Lightbox */}
      {lightboxState && (
        <PhotoLightbox
          photos={lightboxState.photos}
          currentIndex={lightboxState.index}
          onClose={() => setLightboxState(null)}
          onPrev={() =>
            setLightboxState((prev) =>
              prev ? { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length } : null
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
