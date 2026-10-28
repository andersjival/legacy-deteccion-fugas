import React from 'react';
import { RefreshCw, Bell, Volume2, Download, LogOut, X, Wifi } from 'lucide-react';
import { playNotificationChime } from '../../utils/soundAlert';

interface AdminHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  onClose: () => void;
  onInstallPWA?: () => void;
  onRequestNotifications?: () => void;
  isInstallable?: boolean;
  notificationsGranted?: boolean;
  lastUpdated: Date;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onRefresh,
  onLogout,
  onClose,
  onInstallPWA,
  onRequestNotifications,
  isInstallable = false,
  notificationsGranted = false,
  lastUpdated
}) => {
  return (
    <header className="bg-brand-dark text-white px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
      
      {/* Título y Estado En Vivo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-sky-400 flex items-center justify-center font-black shadow-sm">
          L
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight">Panel Administrador PWA</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Auto-Sync (15s)
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Actualizado: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Probar Sonido */}
        <button
          onClick={() => playNotificationChime()}
          title="Probar sonido de notificación"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {/* Activar Web Push */}
        {onRequestNotifications && !notificationsGranted && (
          <button
            onClick={onRequestNotifications}
            title="Activar Notificaciones Push"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-bold transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Activar Push</span>
          </button>
        )}

        {/* Instalar PWA */}
        {isInstallable && onInstallPWA && (
          <button
            onClick={onInstallPWA}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue hover:bg-brand-lightBlue text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar App</span>
          </button>
        )}

        {/* Refrescar */}
        <button
          onClick={onRefresh}
          title="Recargar citas"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Salir */}
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Cerrar Modal / Vista */}
        <button
          onClick={onClose}
          title="Volver al sitio"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
