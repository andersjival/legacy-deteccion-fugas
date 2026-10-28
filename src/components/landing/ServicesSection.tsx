import React from 'react';
import { Search, Compass, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'deteccion',
      title: 'Detección Especializada de Fugas',
      badge: 'Alta Precisión',
      icon: Search,
      color: 'from-blue-600 to-sky-500',
      description: 'Localización exacta de filtraciones invisibles en losas, paredes y jardines mediante geófonos electrónicos, gas trazador y termografía infrarroja.',
      features: ['Geófono electroacústico', 'Cámara térmica FLIR', 'Gas trazador no tóxico']
    },
    {
      id: 'rastreo',
      title: 'Rastreo y Diagnóstico de Tuberías',
      badge: 'Sin Romper',
      icon: Compass,
      color: 'from-brand-dark to-brand-blue',
      description: 'Mapeo técnico de redes hidrosanitarias ocultas, identificación de obstrucciones y evaluación estructural sin destrucción innecesaria.',
      features: ['Mapeo de trayectoria 3D', 'Sonda electromagnética', 'Detección de taponamientos']
    },
    {
      id: 'limpieza',
      title: 'Limpieza Técnica de Tuberías',
      badge: '24/7 Emergencia',
      icon: Sparkles,
      color: 'from-amber-600 to-orange-500',
      description: 'Desinfección, desincrustación y mantenimiento preventivo/correctivo de tuberías de agua potable y desagües para restaurar el flujo y presión óptimos.',
      features: ['Eliminación de sarro profundo', 'Recuperación de presión', 'Desinfección antibacterial']
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de Sección */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs sm:text-sm font-bold text-brand-blue tracking-widest uppercase">
            Servicios Certificados
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            SOLUCIONES DE PRECISIÓN PARA TU HOGAR O EMPRESA
          </h2>
          <p className="text-base text-brand-slate">
            Diagnósticos no destructivos respaldados con tecnología de punta para erradicar filtraciones sin dañar acabados.
          </p>
        </div>

        {/* Grilla de 3 Tarjetas Flotantes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icono y Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${srv.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-ice text-brand-blue border border-brand-iceBorder">
                      {srv.badge}
                    </span>
                  </div>

                  {/* Título y Descripción */}
                  <h3 className="text-xl font-extrabold text-brand-dark mb-3 group-hover:text-brand-blue transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-brand-slate leading-relaxed mb-6">
                    {srv.description}
                  </p>

                  {/* Lista de características */}
                  <div className="space-y-2 mb-8">
                    {srv.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-brand-slate">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón Pastilla Azul Claro */}
                <a
                  href="#agendar"
                  onClick={() => onSelectService(srv.title)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-brand-blue bg-brand-ice hover:bg-brand-blue hover:text-white border border-brand-iceBorder transition-all"
                >
                  <span>Reservar Este Servicio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Banner de Evidencia Real: Ubicación Exacta Antes y Después */}
        <div className="mt-14 bg-gradient-to-r from-brand-dark to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-card border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-black">
              <img
                src="/images/caso-punto-exacto.png"
                alt="Caso real: Ubicamos el punto exacto Antes y Después de reparación de tubería"
                className="w-full h-auto max-h-80 sm:max-h-96 object-contain bg-slate-950 mx-auto"
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold bg-brand-orange/20 text-brand-orange border border-brand-orange/30">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantía de Cero Daño Innecesario</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                UBICAMOS EL PUNTO EXACTO DE LA FUGA
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Detectamos el origen subterráneo u oculto con precisión milimétrica antes de intervenir. Evitamos romper pisos, losas o jardines enteros, excavando únicamente donde se requiere la reparación.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sin rupturas a ciegas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ahorro sustancial en acabados</span>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href="#agendar"
                  onClick={() => onSelectService('Detección Especializada de Fugas')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold text-white bg-brand-orange hover:bg-orange-600 transition-all shadow-glow-orange"
                >
                  <span>Agendar Localización de Fuga</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
