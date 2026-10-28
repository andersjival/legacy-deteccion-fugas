import React from 'react';
import { Phone, Calendar, ShieldCheck, Zap, Crosshair } from 'lucide-react';
import { WaveDivider } from '../common/WaveDivider';

export const HeroSection: React.FC = () => {
  return (
    <section id="inicio" className="relative pt-6 md:pt-12 overflow-hidden bg-gradient-to-br from-[#D8ECFF] via-[#EAF4FF] to-[#F0F8FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda: Mensaje Persuasivo */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Badge de Precisión */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-brand-blue/20 text-brand-blue text-xs sm:text-sm font-bold shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-ping" />
              <Crosshair className="w-4 h-4 text-brand-blue" />
              <span>Tecnología No Invasiva de Alta Precisión</span>
            </div>

            {/* Título Principal H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-extrabold text-brand-dark tracking-tight leading-[1.12]">
              DETECCIÓN ESPECIALIZADA DE FUGAS{' '}
              <span className="text-brand-blue underline decoration-brand-orange/40 decoration-wavy">
                SIN ROMPER
              </span>{' '}
              TUS PAREDES
            </h1>

            {/* Subtítulo Persuasivo */}
            <p className="text-base sm:text-lg text-brand-slate max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Localizamos fugas ocultas, rastreamos tuberías y realizamos limpiezas profundas con equipamiento acústico y térmico de última generación. Altos estándares de calidad garantizados.
            </p>

            {/* Botones CTA Principales */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#agendar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-brand-orange hover:bg-brand-orangeHover shadow-glow-orange hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span>Verificar Disponibilidad y Agendar</span>
              </a>

              <a
                href="tel:+50664080124"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-base font-bold text-brand-dark bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <Phone className="w-5 h-5 text-brand-blue" />
                <span>Llamar al 6408-0124</span>
              </a>
            </div>

            {/* Mini Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-semibold text-brand-slate">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cero Daño a Estructuras</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Diagnóstico Exacto In Situ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-blue font-bold">100%</span>
                <span>Garantía Técnica</span>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Composición Visual Técnica */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Tarjeta Principal de Presentación */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-card border border-white/60">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                  alt="Especialista en detección acústica de fugas Legacy"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />

                {/* Overlay de Diagnóstico Flotante */}
                <div className="absolute bottom-6 left-6 right-6 bg-brand-dark/95 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-brand-blue font-bold">Rastreo Acústico Activo</p>
                      <p className="text-sm font-bold text-white">Geófono Digital y Gas Trazador</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold rounded-lg border border-emerald-500/30">
                      99.8% Precisión
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta Flotante Auxiliar */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-card border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange font-black">
                  24/7
                </div>
                <div>
                  <p className="text-xs text-brand-muted font-medium">Atención de Emergencias</p>
                  <p className="text-sm font-extrabold text-brand-dark">Respuesta Inmediata</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Divisor de Onda SVG hacia la siguiente sección */}
      <WaveDivider fillColor="#FFFFFF" />
    </section>
  );
};
