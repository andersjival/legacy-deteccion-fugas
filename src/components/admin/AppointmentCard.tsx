import React from 'react';
import { Phone, MessageSquare, MapPin, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../types/appointment';
import { formatDateToSpanish, formatTime12h } from '../../utils/dateFormatter';

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onOpenLightbox: (photos: string[], index: number) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onUpdateStatus,
  onOpenLightbox
}) => {
  const rawDigits = appointment.client_phone.replace(/\D/g, '');
  const phoneWithCountry = rawDigits.startsWith('506') ? rawDigits : `506${rawDigits}`;
  const rango_hora = `${formatTime12h(appointment.start_time)} - ${formatTime12h(appointment.end_time)}`;

  const statusConfig = {
    pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    completed: { label: 'Completada', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    cancelled: { label: 'Cancelada', color: 'bg-slate-100 text-slate-500 border-slate-300' }
  };

  const handleQuickConfirmWhatsApp = () => {
    // 1. Actualizar estado a 'confirmed' en D1 y UI
    onUpdateStatus(appointment.id, 'confirmed');

    // 2. Formatear mensaje y abrir WhatsApp
    const fecha = formatDateToSpanish(appointment.appointment_date);
    const mensaje = `Hola *${appointment.client_name}*, le saludamos de *Legacy Detección de Fugas* 💧. Hemos revisado los detalles de su solicitud y le confirmamos su cita para el servicio de *${appointment.service_type}* el día *${fecha}* en el horario de *${rango_hora}*. Por favor envíenos la ubicación exacta por este medio para nuestro registro de ruta. ¡Muchas gracias!`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft hover:shadow-card transition-all space-y-4">
      {/* Top: Cliente, Servicio y Estado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-extrabold text-brand-blue uppercase tracking-wider block">
            {appointment.service_type}
          </span>
          <h4 className="text-lg font-extrabold text-brand-dark">{appointment.client_name}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${statusConfig[appointment.status].color}`}>
            {statusConfig[appointment.status].label}
          </span>
        </div>
      </div>

      {/* Info de Fecha, Rango Horario y Dirección */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-slate font-medium">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-blue shrink-0" />
          <span className="capitalize">{formatDateToSpanish(appointment.appointment_date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-orange shrink-0" />
          <span className="font-bold text-brand-dark">{rango_hora}</span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{appointment.client_address}</span>
        </div>
      </div>

      {/* Descripción del Problema */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
        <p className="font-bold text-slate-700 mb-1">Descripción del Cliente:</p>
        <p className="text-brand-slate italic leading-relaxed">"{appointment.problem_description}"</p>
      </div>

      {/* Galería de Fotos */}
      {appointment.photo_keys && appointment.photo_keys.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-brand-dark mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-brand-blue" />
            <span>Evidencia Fotográfica ({appointment.photo_keys.length} fotos):</span>
          </p>
          <div className="flex gap-2">
            {appointment.photo_keys.map((photoUrl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onOpenLightbox(appointment.photo_keys, i)}
                className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 hover:opacity-90 hover:scale-105 transition-all group"
              >
                <img src={photoUrl} alt="Fuga" className="w-full h-full object-cover" />
                <span className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                  Zoom
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {appointment.photos_deleted === 1 && (
        <p className="text-[11px] text-slate-400 italic">
          📦 Fotos purgadas automáticamente para ahorro de almacenamiento.
        </p>
      )}

      {/* Botón Destacado Verde WhatsApp */}
      <button
        type="button"
        onClick={handleQuickConfirmWhatsApp}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-[#25D366] hover:bg-[#20ba5a] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all"
      >
        <MessageSquare className="w-4 h-4 fill-white text-[#25D366]" />
        <span>Confirmar Cita al Cliente por WhatsApp</span>
      </button>

      {/* Botones Secundarios de Llamada y Otros Estados */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
        <a
          href={`tel:${rawDigits}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-brand-dark bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-brand-blue" />
          <span>Llamar al {appointment.client_phone}</span>
        </a>

        <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
          <button
            onClick={() => onUpdateStatus(appointment.id, 'completed')}
            title="Marca la cita como completada y purga fotos de R2"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              appointment.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
            }`}
          >
            Finalizar
          </button>
          <button
            onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              appointment.status === 'cancelled' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-red-50'
            }`}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
