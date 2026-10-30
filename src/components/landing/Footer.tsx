import React from 'react';
import { Phone, MapPin, Clock, Lock, ShieldCheck } from 'lucide-react';
import { AnimatedEagleLogo } from '../common/AnimatedEagleLogo';
import { SocialLinks } from '../common/SocialLinks';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateAgenda: () => void;
  onNavigateTestimonials?: () => void;
  onInstallPWA?: () => void;
  isInstallable?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onNavigateAgenda,
  onNavigateTestimonials
}) => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Columna 1: Marca y Misión con Águila Animada y Escudo Oficial */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center gap-2">
                <AnimatedEagleLogo className="w-10 h-10 rounded-xl" />
                <img 
                  src="/images/logo-royalty-shield.png" 
                  alt="Escudo Oficial Royalty" 
                  className="w-8 h-9 object-contain drop-shadow-[0_2px_6px_rgba(103,20,29,0.5)]" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300 bg-[length:200%_auto] animate-shimmer-fast bg-clip-text text-transparent">
                  ROYALITY
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase mt-1 bg-gradient-to-r from-cyan-400 via-sky-200 via-cyan-300 to-blue-400 bg-[length:200%_auto] animate-shimmer-fast bg-clip-text text-transparent">
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

            {/* Redes Sociales Oficiales */}
            <div className="pt-2 space-y-1.5">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Redes Sociales Oficiales:
              </span>
              <SocialLinks size="sm" showLabels={true} />
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
              <li>
                <a
                  href="/testimonios"
                  onClick={(e) => {
                    if (onNavigateTestimonials) {
                      e.preventDefault();
                      onNavigateTestimonials();
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Testimonios Verificados
                </a>
              </li>
              <li><a href="/proyecto" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">⚡ Arquitectura del Sistema (/proyecto)</a></li>
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

        {/* Copyright y Redes Rápidas */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="/images/logo-royalty-shield.png" 
              alt="Royalty Sello" 
              className="w-5 h-6 object-contain opacity-70"
            />
            <p>© {new Date().getFullYear()} Royality Detección de Fugas. Todos los derechos reservados.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold hidden md:inline">Síguenos:</span>
            <SocialLinks size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.geosoft.lat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] hover:opacity-90 transition-opacity"
              title="Desarrollado por GeoSoft"
            >
              <span className="animate-copyright-sweep font-bold">
                © Copyright en Royalty Detección by GeoSoft
              </span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
