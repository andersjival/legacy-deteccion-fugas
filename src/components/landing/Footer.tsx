import React from 'react';
import { Phone, MapPin, Clock, Lock, ShieldCheck } from 'lucide-react';
import { AnimatedEagleLogo } from '../common/AnimatedEagleLogo';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateAgenda: () => void;
  onInstallPWA?: () => void;
  isInstallable?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onNavigateAgenda
}) => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Columna 1: Marca y Misión con Águila Animada */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <AnimatedEagleLogo className="w-10 h-10 rounded-xl" />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-[length:200%_auto] animate-shimmer-fast bg-clip-text text-transparent">
                  ROYALITY
                </span>
                <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase mt-1">
                  Detección de Fugas
                </span>
              </div>
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
              <li>
                <a
                  href="/agenda"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateAgenda();
                  }}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Agendar Inspección
                </a>
              </li>
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

          {/* Columna 4: Garantía y Portal Técnico Privado */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Atención Especializada</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Equipos de geófono digital de alta fidelidad, inspección acústica subterránea y termografía infrarroja para residencias, comercios e industrias.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acceso Administrativo Privado</span>
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Royality Detección de Fugas. Todos los derechos reservados.</p>
          <p className="text-[11px]">Diseño y Arquitectura de Alta Precisión.</p>
        </div>

      </div>
    </footer>
  );
};
