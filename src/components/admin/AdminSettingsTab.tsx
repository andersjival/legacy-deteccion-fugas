import React from 'react';
import { Download, Bell, Volume2, LogOut, ShieldCheck, Database, Smartphone } from 'lucide-react';
import { StorageManager } from './StorageManager';
import { ServicesCatalogManager } from './ServicesCatalogManager';
import { playNotificationChime } from '../../utils/soundAlert';
import { Appointment } from '../../types/appointment';

interface AdminSettingsTabProps {
  onLogout: () => void;
  onInstallPWA?: () => void;
  onRequestNotifications?: () => void;
  isInstallable?: boolean;
  notificationsGranted?: boolean;
  appointments?: Appointment[];
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  onLogout,
  onInstallPWA,
  onRequestNotifications,
  isInstallable = false,
  notificationsGranted = false,
  appointments = []
}) => {
  return (
    <div className="space-y-5">
      {/* 1. App Móvil & PWA */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Smartphone className="w-5 h-5 text-brand-blue" />
          <h3 className="text-sm font-extrabold text-brand-dark">Herramientas de Celular (PWA)</h3>
        </div>

        {/* Instalar App en Celular */}
        {isInstallable && onInstallPWA && (
          <button
            type="button"
            onClick={onInstallPWA}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-brand-blue hover:bg-brand-lightBlue text-white text-sm font-black shadow-md active:scale-98 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Instalar App en la Pantalla de Inicio</span>
          </button>
        )}

        {/* Activar Notificaciones Push */}
        {onRequestNotifications && (
          <button
            type="button"
            onClick={onRequestNotifications}
            disabled={notificationsGranted}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold border transition-all ${
              notificationsGranted
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 cursor-default'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>
              {notificationsGranted
                ? '✓ Notificaciones Push Activas'
                : 'Activar Alertas Push al Celular'}
            </span>
          </button>
        )}

        {/* Probar Alerta Sonora */}
        <button
          type="button"
          onClick={() => playNotificationChime()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
        >
          <Volume2 className="w-4 h-4 text-brand-orange" />
          <span>Probar Sonido de Notificación</span>
        </button>
      </div>

      {/* 2. Catálogo Oficial de Servicios (Agregar / Modificar Servicios) */}
      <ServicesCatalogManager />

      {/* 3. Gestor de Limpieza y Almacenamiento */}
      <StorageManager appointments={appointments} />

      {/* 4. Cerrar Sesión */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-extrabold transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión del Panel</span>
        </button>
      </div>
    </div>
  );
};
