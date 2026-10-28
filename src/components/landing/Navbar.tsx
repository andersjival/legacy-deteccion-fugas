import React, { useState } from 'react';
import { Phone, Calendar, Lock, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Técnico */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-dark to-brand-blue flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#FF5722" stroke="#FF5722"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
                <path d="M4.93 19.07a10 10 0 0 1 0-14.14" stroke="white" strokeDasharray="2 2" opacity="0.6"/>
              </svg>
            </div>
            <div>
              <span className="block text-xl font-extrabold tracking-tight text-brand-dark font-sans leading-none">
                LEGACY
              </span>
              <span className="block text-xs font-semibold text-brand-blue tracking-wider uppercase mt-0.5">
                Detección de Fugas
              </span>
            </div>
          </a>

          {/* Enlaces Desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-brand-slate">
            <a href="#inicio" className="hover:text-brand-blue transition-colors">Inicio</a>
            <a href="#servicios" className="hover:text-brand-blue transition-colors">Servicios</a>
            <a href="#tecnologia" className="hover:text-brand-blue transition-colors">Tecnología</a>
            <a href="#agendar" className="hover:text-brand-blue transition-colors">Agendar</a>
            <a href="#testimonios" className="hover:text-brand-blue transition-colors">Testimonios</a>
          </nav>

          {/* Acciones Derecha */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="tel:+50664080124"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold text-brand-dark bg-brand-ice hover:bg-brand-iceBorder border border-brand-iceBorder transition-all"
            >
              <Phone className="w-4 h-4 text-brand-blue animate-pulse" />
              <span>6408-0124</span>
            </a>

            <a
              href="#agendar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold text-white bg-brand-orange hover:bg-brand-orangeHover shadow-glow-orange hover:shadow-lg transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Cita</span>
            </a>

            {/* Acceso Discreto Admin */}
            <button
              onClick={onOpenAdmin}
              aria-label="Panel Administrador"
              title="Panel de Control Privado"
              className="p-2.5 rounded-xl text-slate-400 hover:text-brand-dark hover:bg-slate-100 transition-colors ml-1"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>

          {/* Hamburguesa Móvil */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              aria-label="Panel Admin"
              className="p-2 text-slate-400 hover:text-brand-dark"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-dark hover:bg-slate-100"
              aria-label="Menú principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-brand-slate hover:bg-brand-ice"
          >
            Inicio
          </a>
          <a
            href="#servicios"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-brand-slate hover:bg-brand-ice"
          >
            Servicios
          </a>
          <a
            href="#tecnologia"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-brand-slate hover:bg-brand-ice"
          >
            Tecnología
          </a>
          <a
            href="#agendar"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-brand-slate hover:bg-brand-ice"
          >
            Agendar Cita
          </a>
          <a
            href="#testimonios"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-brand-slate hover:bg-brand-ice"
          >
            Testimonios
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="tel:+50664080124"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-brand-ice text-brand-dark border border-brand-iceBorder"
            >
              <Phone className="w-4 h-4 text-brand-blue" />
              Llamar al 6408-0124
            </a>
            <a
              href="#agendar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold bg-brand-orange text-white shadow-glow-orange"
            >
              <Calendar className="w-4 h-4" />
              Agendar Inspección Ahora
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
