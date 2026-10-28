import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Ing. Mauricio Alvarado',
      location: 'Curridabat, San José',
      review: 'Tenía 3 meses con el recibo de agua disparado y dos fontaneros anteriores querían picar toda la cocina. Los técnicos de Legacy vinieron con el geófono y en 25 minutos marcaron un único punto exacto bajo el fregadero. Impresionante precisión.',
      rating: 5,
      service: 'Detección Especializada de Fugas'
    },
    {
      name: 'Licda. Marcela Chaves',
      location: 'San Rafael de Escazú',
      review: 'Excelente trato y puntualidad británica. Agendé desde la página, me confirmaron de inmediato y resolvieron una filtración oculta en la losa del segundo piso sin romper un solo azulejo. 100% recomendados.',
      rating: 5,
      service: 'Rastreo y Diagnóstico'
    },
    {
      name: 'Arq. Roberto Solís',
      location: 'Alajuela, La Guácima',
      review: 'Los contratamos para el diagnóstico de una residencia en condominio. El informe técnico que nos entregaron fue tan claro que el seguro reconoció los costos sin objeción. La tecnología acústica que usan es de primer mundo.',
      rating: 5,
      service: 'Informe Técnico Certificado'
    }
  ];

  return (
    <section id="testimonios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-bold text-brand-blue tracking-widest uppercase">
            Experiencias Comprobadas
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            CLIENTES QUE PROTEGIERON SUS HOGARES
          </h2>
          <p className="text-base text-brand-slate">
            Más de 850 inspecciones realizadas con 0% de demoliciones innecesarias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-brand-surface rounded-3xl p-8 border border-slate-100 shadow-soft flex flex-col justify-between hover:shadow-card transition-all"
            >
              <div>
                {/* Estrellas */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-brand-slate italic leading-relaxed mb-6">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-dark">{t.name}</h4>
                    <p className="text-xs text-brand-muted">{t.location}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <CheckCircle className="w-3 h-3" />
                    Verificado
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
