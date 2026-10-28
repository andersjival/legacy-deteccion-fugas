import React from 'react';
import { Check, ShieldAlert, Award, Clock, DollarSign, ArrowUpRight } from 'lucide-react';
import { WaveDivider } from '../common/WaveDivider';

interface TechShowcaseProps {
  onNavigateAgenda: () => void;
}

export const TechShowcase: React.FC<TechShowcaseProps> = ({ onNavigateAgenda }) => {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Ahorro Drástico en Reparaciones',
      desc: 'Evita romper pisos de porcelanato, paredes o jardines buscando a ciegas. Marcamos el punto exacto con precisión milimétrica.'
    },
    {
      icon: Award,
      title: 'Reporte Técnico Certificado',
      desc: 'Entregamos informe fotográfico y diagnóstico formal válido para reclamos ante aseguradoras y proveedores de agua.'
    },
    {
      icon: Clock,
      title: 'Puntualidad y Respuesta Rápida',
      desc: 'Atendemos con citas programadas estrictas para resolver tu fuga antes de que cause daños estructurales graves.'
    }
  ];

  return (
    <div className="relative bg-[#EBF5FF] overflow-hidden">
      <WaveDivider fillColor="#EBF5FF" className="-mt-1" />

      <section id="tecnologia" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Columna Izquierda: Razones de Elección */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-brand-blue border border-brand-iceBorder">
                Equipamiento de Vanguardia
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight leading-tight">
                ¿POR QUÉ ELEGIR A <span className="text-brand-blue">LEGACY</span> PARA TUS FUGAS?
              </h2>

              <p className="text-base text-brand-slate leading-relaxed">
                Utilizamos detectores electroacústicos alemanes, cámaras termográficas FLIR y mezclas trazadoras inocuas para ubicar filtraciones ocultas sin causar un solo daño a tu propiedad.
              </p>

              <div className="space-y-4 pt-2">
                {benefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-brand-dark">{b.title}</h4>
                        <p className="text-xs sm:text-sm text-brand-slate mt-0.5">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onNavigateAgenda}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-brand-dark hover:bg-slate-800 shadow-card transition-all"
                >
                  <span>Reservar Diagnóstico</span>
                  <ArrowUpRight className="w-5 h-5 text-brand-orange" />
                </button>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta Técnica Asimétrica */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-white p-3 shadow-card border border-white">
                <img
                  src="/images/tecnologia-equipo.png"
                  alt="Equipamiento de alta gama para detección acústica y trazado Legacy"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
                <div className="p-4 bg-brand-dark text-white rounded-xl mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-brand-orange font-bold uppercase tracking-wider block">Inspección Térmica</span>
                    <span className="text-sm font-bold">Rastreadores Digitales Homologados</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <WaveDivider fillColor="#FFFFFF" isFlipped={true} className="-mb-1" />
    </div>
  );
};
