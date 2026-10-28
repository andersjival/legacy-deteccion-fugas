import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, AlertCircle, Check, Loader2 } from 'lucide-react';
import { AvailabilityResponse } from '../../../types/appointment';
import { api } from '../../../services/api';
import { getNextDays, formatTime12h, formatDateToSpanish } from '../../../utils/dateFormatter';

interface StepDateAndTimeProps {
  selectedDate: string;
  selectedTime: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onNext: () => void;
}

export const StepDateAndTime: React.FC<StepDateAndTimeProps> = ({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onNext
}) => {
  const days = getNextDays(14);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate && days.length > 0) {
      onSelectDate(days[0].date);
    }
  }, [days, onSelectDate, selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;
    let isMounted = true;
    setLoading(true);

    api.getAvailability(selectedDate)
      .then((res) => {
        if (isMounted) setAvailability(res);
      })
      .catch((err) => console.warn('Error loading availability:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [selectedDate]);

  return (
    <div className="space-y-8">
      {/* 1. Selector Horizontal de Días */}
      <div>
        <label className="flex items-center gap-2 text-sm font-extrabold text-brand-dark mb-3">
          <CalendarIcon className="w-4 h-4 text-brand-blue" />
          <span>1. Selecciona la Fecha para la Inspección</span>
        </label>
        
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
          {days.map((d) => {
            const isSelected = d.date === selectedDate;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => {
                  onSelectDate(d.date);
                  onSelectTime(''); // Reset time on date change
                }}
                className={`flex-shrink-0 snap-start w-20 py-3 px-2 rounded-2xl flex flex-col items-center justify-center border text-center transition-all ${
                  isSelected
                    ? 'bg-brand-blue text-white border-brand-blue shadow-glow-blue scale-105'
                    : 'bg-white text-brand-dark border-slate-200 hover:border-brand-blue/50 hover:bg-brand-ice'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {d.dayName}
                </span>
                <span className="text-xl font-extrabold my-0.5">
                  {d.dayNumber}
                </span>
                {d.isToday && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white text-brand-blue' : 'bg-brand-orange text-white'}`}>
                    HOY
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-brand-slate mt-2 capitalize font-medium">
          📅 {formatDateToSpanish(selectedDate)}
        </p>
      </div>

      {/* 2. Selector de Horarios Disponibles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-extrabold text-brand-dark">
            <Clock className="w-4 h-4 text-brand-blue" />
            <span>2. Bloques Horarios Disponibles</span>
          </label>
          {availability && (
            <span className="text-xs font-semibold text-brand-slate">
              Cupos ocupados: {availability.total_booked} / {availability.max_allowed}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-brand-blue gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Consultando agenda disponible...</span>
          </div>
        ) : availability && availability.slots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availability.slots.map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  className={`py-3 px-3 rounded-xl border text-center font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                    !slot.available
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-brand-orange text-white border-brand-orange shadow-glow-orange scale-102'
                      : 'bg-white text-brand-dark border-slate-200 hover:border-brand-blue hover:bg-brand-ice'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{formatTime12h(slot.time)}</span>
                  </div>
                  {!slot.available && (
                    <span className="text-[10px] text-red-500 font-semibold leading-tight">
                      {slot.reason || 'Ocupado'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm">
              No hay horarios disponibles para esta fecha o el día no es laborable. Por favor seleccione otro día en el calendario.
            </p>
          </div>
        )}
      </div>

      {/* Botón Siguiente Paso */}
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          disabled={!selectedDate || !selectedTime}
          onClick={onNext}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-white bg-brand-blue hover:bg-brand-lightBlue disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Continuar con Datos del Cliente</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
