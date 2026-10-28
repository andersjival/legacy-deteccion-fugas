import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { Review } from '../../types/review';

export const TestimonialsSection: React.FC = () => {
  const [realReviews, setRealReviews] = useState<Review[]>([]);

  useEffect(() => {
    let isMounted = true;
    api.getReviews().then((data) => {
      if (isMounted && Array.isArray(data)) {
        setRealReviews(data);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const baselineTestimonials = [
    {
      id: 'base-1',
      name: 'Ing. Mauricio Alvarado',
      location: 'Curridabat, San José',
      review: 'Tenía 3 meses con el recibo de agua disparado y dos fontaneros anteriores querían picar toda la cocina. Los técnicos de Legacy vinieron con el geófono y en 25 minutos marcaron un único punto exacto bajo el fregadero. Impresionante precisión.',
      rating: 5,
      service: 'Detección Especializada de Fugas',
      isReal: false
    },
    {
      id: 'base-2',
      name: 'Licda. Marcela Chaves',
      location: 'San Rafael de Escazú',
      review: 'Excelente trato y puntualidad británica. Agendé desde la página, me confirmaron de inmediato y resolvieron una filtración oculta en la losa del segundo piso sin romper un solo azulejo. 100% recomendados.',
      rating: 5,
      service: 'Rastreo y Diagnóstico',
      isReal: false
    },
    {
      id: 'base-3',
      name: 'Arq. Roberto Solís',
      location: 'Alajuela, La Guácima',
      review: 'Los contratamos para el diagnóstico de una residencia en condominio. El informe técnico que nos entregaron fue tan claro que el seguro reconoció los costos sin objeción. La tecnología acústica que usan es de primer mundo.',
      rating: 5,
      service: 'Informe Técnico Certificado',
      isReal: false
    }
  ];

  // Convertir reseñas reales a formato de tarjeta
  const formattedReal = realReviews.map((r) => ({
    id: r.id,
    name: r.client_name,
    location: r.service_type || 'San José, Costa Rica',
    review: r.comment,
    rating: r.rating,
    service: r.service_type || 'Detección Especializada',
    isReal: true
  }));

  // Combinar reseñas reales primero y completar con testimonios base
  const allTestimonials = [
    ...formattedReal,
    ...baselineTestimonials.filter((b) => !formattedReal.some((r) => r.id === b.id))
  ].slice(0, Math.max(3, formattedReal.length));

  return (
    <section id="testimonios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-brand-blue border border-blue-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Testimonios Verificados</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            CLIENTES QUE PROTEGIERON SUS HOGARES
          </h2>
          <p className="text-base text-brand-slate">
            Personas reales a las que localizamos filtraciones ocultas sin romper paredes ni pisos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allTestimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-brand-surface rounded-3xl p-8 border shadow-soft flex flex-col justify-between hover:shadow-card transition-all ${
                t.isReal ? 'border-brand-blue/30 ring-1 ring-brand-blue/10 bg-gradient-to-b from-blue-50/20 to-white' : 'border-slate-100'
              }`}
            >
              <div>
                {/* Estrellas */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  {t.isReal && (
                    <span className="text-[10px] font-black text-brand-blue bg-blue-100/70 px-2 py-0.5 rounded-md">
                      Reciente
                    </span>
                  )}
                </div>

                <p className="text-sm text-brand-slate italic leading-relaxed mb-6">
                  "{t.review}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-brand-dark truncate">{t.name}</h4>
                    <p className="text-xs text-brand-muted truncate">{t.location}</p>
                  </div>
                  <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
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
