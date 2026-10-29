import React, { useState } from 'react';
import { AdminBottomNav, AdminTab } from './AdminBottomNav';
import { TodayRouteCard } from './TodayRouteCard';
import { AppointmentCard } from './AppointmentCard';
import { PhotoLightbox } from './PhotoLightbox';
import { AvailabilityManager } from './AvailabilityManager';
import { AdminSettingsTab } from './AdminSettingsTab';
import { KPICards } from './KPICards';
import { FinancialReportCard } from './FinancialReportCard';
import { AdminReviewsCard } from './AdminReviewsCard';
import { JobQuoteManager } from '../quotes/JobQuoteManager';
import { TrafficAnalytics } from './TrafficAnalytics';
import { AnimatedEagleLogo } from '../common/AnimatedEagleLogo';
import { useAppointments } from '../../hooks/useAppointments';
import { useReviews } from '../../hooks/useReviews';
import { getTodayDateString, getTomorrowDateString, formatTime12h } from '../../utils/dateFormatter';
import { Bell, RefreshCw, X, Navigation, Star, Laptop, Smartphone, Calendar, Clock, Settings, FileText, BarChart3, Eye } from 'lucide-react';

interface AdminViewProps {
  onClose: () => void;
  onLogout: () => void;
  onInstallPWA?: () => void;
  onRequestNotifications?: () => void;
  isInstallable?: boolean;
  notificationsGranted?: boolean;
}

const VALID_ADMIN_TABS: AdminTab[] = ['route', 'all', 'quotes', 'traffic', 'schedule', 'settings', 'reviews'];

const getInitialAdminTab = (): AdminTab => {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as AdminTab;
      if (tabParam && VALID_ADMIN_TABS.includes(tabParam)) {
        return tabParam;
      }
      const savedTab = localStorage.getItem('royalty_admin_active_tab') as AdminTab;
      if (savedTab && VALID_ADMIN_TABS.includes(savedTab)) {
        return savedTab;
      }
    } catch (e) {}
  }
  return 'route';
};

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
    updateStatus,
    updateService,
    updatePayment
  } = useAppointments(true);

  const {
    reviews,
    newReviewAlert,
    dismissAlert: dismissReviewAlert,
    removeReview
  } = useReviews(true);

  const [activeTab, setActiveTabState] = useState<AdminTab>(getInitialAdminTab);

  const setActiveTab = (tab: AdminTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('royalty_admin_active_tab', tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }
  };

  // Mantener sincronizada la URL y localStorage en montaje o cambios
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('royalty_admin_active_tab', activeTab);
        const url = new URL(window.location.href);
        if (url.searchParams.get('tab') !== activeTab) {
          url.searchParams.set('tab', activeTab);
          window.history.replaceState({}, '', url.toString());
        }
      } catch (e) {}
    }
  }, [activeTab]);

  // Escuchar si el usuario navega con botones adelante/atrás del navegador
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as AdminTab;
      if (tabParam && VALID_ADMIN_TABS.includes(tabParam) && tabParam !== activeTab) {
        setActiveTabState(tabParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeTab]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'tomorrow'>('all');
  const [lightboxState, setLightboxState] = useState<{ photos: string[]; index: number } | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 768;
  });

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();

  // Función para llevar directamente a la cita especificada
  const handleViewAppointment = (app: any) => {
    if (!app) return;
    const isToday = app.appointment_date === todayStr;
    if (isToday) {
      setActiveTab('route');
    } else {
      setActiveTab('all');
      setFilterStatus('all');
    }

    setHighlightedId(app.id);
    dismissAlert();

    // Desplazamiento suave directo hacia la tarjeta de la cita
    setTimeout(() => {
      const el = document.getElementById(`appointment-${app.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);

    // Retirar el resalte después de 6 segundos
    setTimeout(() => {
      setHighlightedId(null);
    }, 6000);
  };

  // Escuchar si se abre el panel con parámetro de cita en URL (?appointmentId=... o ?cita=...)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const targetAppointmentId = params.get('appointmentId') || params.get('cita');
    if (targetAppointmentId && appointments.length > 0) {
      const found = appointments.find((a) => a.id === targetAppointmentId);
      if (found) {
        handleViewAppointment(found);
      }
    }
  }, [appointments]);

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
      
      {/* Header Adaptativo: Móvil y Computadora */}
      <header className="bg-brand-dark text-white px-4 md:px-8 py-3 flex items-center justify-between shrink-0 shadow-md border-b border-slate-800">
        
        {/* Izquierda: Logo, Título y Modo de Dispositivo Detectado */}
        <div className="flex items-center gap-3">
          <AnimatedEagleLogo className="w-9 h-9 rounded-xl shadow-sm" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-black tracking-tight leading-none">Royality Panel</h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                {isDesktop ? <Laptop className="w-3 h-3 text-brand-blue" /> : <Smartphone className="w-3 h-3 text-brand-orange" />}
                <span>{isDesktop ? 'Vista PC / Escritorio' : 'Vista Móvil'}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">En Vivo D1</span>
            </div>
          </div>
        </div>

        {/* Centro (Desktop): Barra de Pestañas Superior para Computadora */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          {[
            { id: 'route' as AdminTab, label: 'Ruta de Hoy', icon: Navigation, count: todayAppointments.length },
            { id: 'all' as AdminTab, label: 'Todas las Citas', icon: Calendar, count: pendingAppointments.length },
            { id: 'traffic' as AdminTab, label: 'Tráfico & Métricas', icon: BarChart3, count: 0 },
            { id: 'quotes' as AdminTab, label: 'Cotizador', icon: FileText, count: 0 },
            { id: 'schedule' as AdminTab, label: 'Horarios', icon: Clock, count: 0 },
            { id: 'settings' as AdminTab, label: 'Ajustes', icon: Settings, count: 0 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 min-w-[18px] text-[10px] font-black rounded-full flex items-center justify-center ${
                    tab.id === 'route' ? 'bg-brand-orange text-white' : 'bg-red-500 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Derecha: Botón Testimonios y Reseñas en pequeño (sustituye a Refrescar) y Cerrar */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            title="Ver Testimonios y Reseñas de Clientes"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300/50'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline text-xs">Reseñas</span>
            {reviews.length > 0 && (
              <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${
                activeTab === 'reviews' ? 'bg-white text-amber-900' : 'bg-amber-500 text-white'
              }`}>
                {reviews.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Salir"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-red-900/60 active:scale-95 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold">Cerrar</span>
          </button>
        </div>
      </header>

      {/* Alerta flotante en tiempo real si entra una nueva cita */}
      {newAppointmentAlert && (
        <div className="bg-brand-orange text-white px-4 py-3 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                  ¡NUEVA CITA REGISTRADA!
                </span>
                <span className="text-xs font-black">
                  {newAppointmentAlert.appointment_date} {newAppointmentAlert.start_time ? `(${formatTime12h(newAppointmentAlert.start_time)})` : ''}
                </span>
              </div>
              <p className="text-xs font-bold text-white/95 mt-0.5">
                Cliente: <strong>{newAppointmentAlert.client_name}</strong> • {newAppointmentAlert.service_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end">
            {/* BOTÓN VER CITA QUE LO LLEVA DIRECTO A LA CITA */}
            <button
              type="button"
              onClick={() => handleViewAppointment(newAppointmentAlert)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black text-brand-dark bg-white hover:bg-slate-100 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Ir directamente a los detalles de esta cita"
            >
              <Eye className="w-4 h-4 text-brand-orange" />
              <span>Ver Cita</span>
            </button>

            <button 
              type="button"
              onClick={dismissAlert} 
              className="p-1.5 hover:bg-black/20 rounded-xl transition-colors cursor-pointer"
              title="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Alerta flotante en tiempo real si un cliente publica una calificación / reseña */}
      {newReviewAlert && (
        <div className="bg-amber-500 text-white px-4 py-3 shadow-lg flex items-center justify-between shrink-0 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-black">
            <Star className="w-4 h-4 shrink-0 fill-white" />
            <span>
              ¡NUEVO TESTIMONIO! {newReviewAlert.client_name} ({newReviewAlert.rating}★): "{newReviewAlert.comment.substring(0, 35)}..."
            </span>
          </div>
          <button onClick={dismissReviewAlert} className="p-1 hover:bg-black/20 rounded-lg cursor-pointer" title="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Área de Contenido Adaptativo (Móvil centrado / PC pantalla ancha con rejillas) */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 pb-28 md:pb-12 max-w-lg md:max-w-6xl xl:max-w-7xl w-full mx-auto space-y-6">
        
        {/* TAB 1: RUTA DE HOY (Modo Calle en Móvil / Cuadrícula de Paradas en PC) */}
        {activeTab === 'route' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-base sm:text-lg font-black text-brand-dark">Plan de Ruta de Hoy</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {todayAppointments.length} trabajos agendados para hoy
                </p>
              </div>
              <span className="text-xs font-black text-brand-blue bg-brand-ice px-3 py-1 rounded-xl border border-brand-iceBorder">
                HOY
              </span>
            </div>

            {/* Reporte Financiero Diario y Semanal */}
            <FinancialReportCard appointments={appointments} />

            {loading ? (
              <div className="text-center py-12 text-xs font-bold text-brand-blue">Cargando ruta de hoy...</div>
            ) : todayAppointments.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-brand-ice text-brand-blue flex items-center justify-center mx-auto">
                  <Navigation className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-brand-dark">Sin trabajos pendientes hoy</h4>
                <p className="text-xs text-slate-500">
                  Las nuevas citas para hoy se organizarán automáticamente en este plan de ruta.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayAppointments.map((app, idx) => (
                  <TodayRouteCard
                    key={app.id}
                    appointment={app}
                    index={idx}
                    onUpdateStatus={updateStatus}
                    onUpdateService={updateService}
                    onUpdatePayment={updatePayment}
                    onOpenLightbox={(photos, index) => setLightboxState({ photos, index })}
                    isHighlighted={highlightedId === app.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TODAS LAS CITAS CON FILTROS RÁPIDOS Y MÉTRICAS */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {/* 1. Métricas Principales de Citas (Fila completa, altura compacta, sin truncado ni espacio muerto) */}
            <KPICards appointments={appointments} />

            {/* 2. Cierre Financiero de Citas */}
            <div className="w-full">
              <FinancialReportCard appointments={appointments} />
            </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAppointments.map((app) => (
                  <AppointmentCard
                    key={app.id}
                    appointment={app}
                    onUpdateStatus={updateStatus}
                    onUpdateService={updateService}
                    onUpdatePayment={updatePayment}
                    onOpenLightbox={(photos, index) => setLightboxState({ photos, index })}
                    isHighlighted={highlightedId === app.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COTIZADOR DE TRABAJOS EN LÍNEA */}
        {activeTab === 'quotes' && (
          <div className="w-full">
            <JobQuoteManager />
          </div>
        )}

        {/* TAB TRÁFICO Y MÉTRICAS EN VIVO (FB, IG, WA, DIRECTO) */}
        {activeTab === 'traffic' && (
          <div className="w-full">
            <TrafficAnalytics />
          </div>
        )}

        {/* TAB 4: HORARIOS Y "MAÑANA VOY A TRABAJAR" */}
        {activeTab === 'schedule' && (
          <div className="max-w-4xl mx-auto">
            <AvailabilityManager />
          </div>
        )}

        {/* TAB 4: AJUSTES, PWA Y LIMPIEZA */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto">
            <AdminSettingsTab
              onLogout={onLogout}
              onInstallPWA={onInstallPWA}
              onRequestNotifications={onRequestNotifications}
              isInstallable={isInstallable}
              notificationsGranted={notificationsGranted}
              appointments={appointments}
            />
          </div>
        )}

        {/* TAB 7: TESTIMONIOS Y RESEÑAS EN PÁGINA INDEPENDIENTE */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-1">
              <div>
                <h2 className="text-base sm:text-lg font-black text-brand-dark">Testimonios y Reseñas de Clientes</h2>
                <p className="text-xs text-slate-500 font-medium">
                  Muro oficial de opiniones verificadas y calificaciones recibidas en el sistema
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const reviewUrl = `${window.location.origin}/calificar`;
                  navigator.clipboard.writeText(reviewUrl);
                  alert('¡Enlace para pedir calificación a clientes copiado al portapapeles!');
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Copiar enlace para enviar por WhatsApp al cliente"
              >
                <Star className="w-4 h-4 fill-white" />
                <span>Copiar Enlace de Calificación</span>
              </button>
            </div>
            <AdminReviewsCard reviews={reviews} onDeleteReview={removeReview} />
          </div>
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
