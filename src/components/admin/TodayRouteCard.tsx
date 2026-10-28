import React, { useState } from 'react';
import { Navigation, Phone, MessageSquare, CheckCircle, MapPin, ChevronDown, ChevronUp, Image as ImageIcon, Clock, Edit3, FastForward } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { formatTime12h, formatDateToSpanish } from '../../utils/dateFormatter';
import { ServiceEditorModal } from './ServiceEditorModal';

interface TodayRouteCardProps {
  appointment: Appointment;
  index: number;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onOpenLightbox: (photos: string[], index: number) => void;
  onUpdateService?: (id: string, newServiceType: string) => Promise<void>;
}

export const TodayRouteCard: React.FC<TodayRouteCardProps> = ({
  appointment,
  index,
  onUpdateStatus,
  onOpenLightbox,
  onUpdateService
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const rawDigits = appointment.client_phone.replace(/\D/g, '');
  const phoneWithCountry = rawDigits.startsWith('506') ? rawDigits : `506${rawDigits}`;
  const rangoHora = `${formatTime12h(appointment.start_time)} - ${formatTime12h(appointment.end_time)}`;

  const hasCoordinates = appointment.latitude !== null && appointment.latitude !== undefined &&
                         appointment.longitude !== null && appointment.longitude !== undefined;

  const wazeUrl = hasCoordinates
    ? `https://waze.com/ul?ll=${appointment.latitude},${appointment.longitude}&navigate=yes`
    : `https://waze.com/ul?q=${encodeURIComponent(appointment.client_address)}&navigate=yes`;

  const handleConfirmWhatsApp = () => {
    onUpdateStatus(appointment.id, 'confirmed');
    const fecha = formatDateToSpanish(appointment.appointment_date);
    const mensaje = `Hola *${appointment.client_name}*, le saludamos de *Legacy Detección de Fugas* 💧. Hemos revisado los detalles de su solicitud y le confirmamos su cita para el servicio de *${appointment.service_type}* el día *${fecha}* en el horario de *${rangoHora}*. Por favor envíenos la ubicación exacta por este medio para nuestro registro de ruta. ¡Muchas gracias!`;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAdvanceAppointmentWhatsApp = () => {
    const fecha = formatDateToSpanish(appointment.appointment_date);
    const mensaje = `Hola *${appointment.client_name}*, le saluda el técnico de *Legacy Detección de Fugas* 💧.\n\nLe consultamos sobre su cita para *${appointment.service_type}*, programada para el día *${fecha}* (${rangoHora}).\n\nAcabamos de terminar un trabajo previo más rápido de lo esperado y ya contamos con disponibilidad inmediata en este momento. ¿Le sería posible atendernos más temprano el día de hoy?\n\nQuedamos atentos a su confirmación. ¡Muchas gracias!`;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const isCompleted = appointment.status === 'completed';

  return (
    <div className={`rounded-3xl border p-4 sm:p-5 shadow-card transition-all ${
      isCompleted ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-brand-blue/20 ring-1 ring-brand-blue/10'
    }`}>
      
      {/* Turno y Número de Parada */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs font-black">
            #{index + 1}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-black text-brand-dark bg-brand-ice px-2.5 py-1 rounded-xl border border-brand-iceBorder">
            <Clock className="w-3.5 h-3.5 text-brand-orange" />
            <span>{rangoHora}</span>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
          isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {isCompleted ? 'Finalizada' : 'En Ruta'}
        </span>
      </div>

      {/* Info Principal Cliente */}
      <div className="py-3 space-y-1.5">
        <h3 className="text-base font-extrabold text-brand-dark leading-snug">
          {appointment.client_name}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs font-bold text-brand-blue">
            {appointment.service_type}
          </p>
          {onUpdateService && (
            <button
              type="button"
              onClick={() => setIsEditorOpen(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-blue-50 hover:bg-blue-100 text-brand-blue border border-blue-200 transition-colors cursor-pointer"
              title="Cambiar o agregar más servicios a esta cita"
            >
              <Edit3 className="w-2.5 h-2.5" />
              <span>Editar / +Servicios</span>
            </button>
          )}
        </div>
        <div className="flex items-start gap-1.5 text-xs text-brand-slate font-medium pt-1">
          <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{appointment.client_address}</span>
        </div>
      </div>

      {/* BOTONES RÁPIDOS MÓVILES PARA LA CALLE */}
      <div className="space-y-2 pt-1">
        {/* Botón Gigante Waze */}
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-black text-white bg-[#33CCFF] hover:bg-[#28b2e0] shadow-md active:scale-98 transition-all"
        >
          <Navigation className="w-5 h-5 fill-white" />
          <span>Iniciar Ruta en Waze</span>
        </a>

        {/* Fila de Llamada y WhatsApp */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${rawDigits}`}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs font-extrabold text-brand-dark bg-slate-100 hover:bg-slate-200 border border-slate-200 active:scale-98 transition-all"
          >
            <Phone className="w-4 h-4 text-brand-blue" />
            <span>Llamar</span>
          </a>

          <button
            type="button"
            onClick={handleConfirmWhatsApp}
            className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl text-xs font-extrabold text-white bg-[#25D366] hover:bg-[#20ba5a] shadow-sm active:scale-98 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Botón Adelantar Cita por WhatsApp (en caso de terminar rápido el trabajo previo) */}
        {!isCompleted && (
          <button
            type="button"
            onClick={handleAdvanceAppointmentWhatsApp}
            className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-xs font-black text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 shadow-xs active:scale-98 transition-all"
          >
            <FastForward className="w-4 h-4 text-amber-700 fill-amber-700" />
            <span>Adelantar Cita por WhatsApp</span>
          </button>
        )}

        {/* Botón Finalizar */}
        {!isCompleted && (
          <button
            type="button"
            onClick={() => onUpdateStatus(appointment.id, 'completed')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Marcar Trabajo como Finalizado</span>
          </button>
        )}
      </div>

      {/* Detalle Desplegable: Descripción y Fotos */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-1.5 text-xs font-bold text-slate-500 hover:text-brand-dark"
        >
          <span>{expanded ? 'Ocultar detalles y fotos' : 'Ver problema reportado y fotos'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="pt-2 space-y-2 text-xs border-t border-slate-100 mt-1">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-700 mb-1">Problema Reportado:</p>
              <p className="text-slate-600 italic leading-relaxed">"{appointment.problem_description}"</p>
            </div>

            {appointment.photo_keys && appointment.photo_keys.length > 0 && (
              <div>
                <p className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Fotos de Evidencia:</span>
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {appointment.photo_keys.map((photoUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onOpenLightbox(appointment.photo_keys, i)}
                      className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0"
                    >
                      <img src={photoUrl} alt="Fuga" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para Editar o Agregar Múltiples Servicios */}
      {isEditorOpen && (
        <ServiceEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          appointmentId={appointment.id}
          clientName={appointment.client_name}
          currentServiceType={appointment.service_type}
          onSaveService={async (id, srv) => {
            if (onUpdateService) await onUpdateService(id, srv);
          }}
        />
      )}
    </div>
  );
};
