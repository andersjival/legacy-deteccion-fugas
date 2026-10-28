import React from 'react';
import { Phone, MapPin, Clock, Lock, Download, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateAgenda: () => void;
  onInstallPWA?: () => void;
  isInstallable?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onNavigateAgenda,
  onInstallPWA,
  isInstallable = false
}) => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Columna 1: Marca y Misión */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-700/50 p-1 flex items-center justify-center shadow-sm overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Logo Legacy Detección de Fugas"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight">LEGACY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Especialistas en detección no invasiva de fugas, rastreo de tuberías y desincrustación técnica en todo el país.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantía de Cero Destrucción</span>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Servicios Técnicos</a></li>
              <li><a href="#tecnologia" className="hover:text-white transition-colors">Equipamiento FLIR / Geófono</a></li>
              <li><button onClick={onNavigateAgenda} className="hover:text-white transition-colors text-left">Agendar Inspección</button></li>
              <li><a href="#testimonios" className="hover:text-white transition-colors">Testimonios Verificados</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto Directo */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Atención Directa</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-orange" />
                <a href="tel:+50664080124" className="text-white font-bold hover:underline">
                  6408-0124
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-blue" />
                <span>Lunes a Sábado: 8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Cobertura en Gran Área Metropolitana</span>
              </div>
            </div>
          </div>

          {/* Columna 4: PWA y Acceso Seguro */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Aplicación Móvil</h4>
            <p className="text-xs text-slate-400">
              Instala la aplicación en tu teléfono para acceso instantáneo a reservas y gestión técnica.
            </p>
            {isInstallable && (
              <button
                type="button"
                onClick={onInstallPWA}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-lightBlue text-white text-xs font-bold transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Instalar App en Celular</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors pt-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Administrativo Privado</span>
            </button>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Legacy Detección de Fugas. Todos los derechos reservados.</p>
          <p className="text-[11px]">Diseño y Arquitectura de Alta Precisión.</p>
        </div>

      </div>
    </footer>
  );
};
