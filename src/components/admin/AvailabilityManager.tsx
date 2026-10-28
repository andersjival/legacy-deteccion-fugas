import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Check, Save, Sliders, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { GlobalSettings, WorkDay } from '../../types/appointment';
import { api } from '../../services/api';
import { getNextDays, formatDateToSpanish } from '../../utils/dateFormatter';

export const AvailabilityManager: React.FC = () => {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isDayAvailable, setIsDayAvailable] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [savingDay, setSavingDay] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const days = getNextDays(14);

  useEffect(() => {
    api.getSettings().then((s) => {
      setSettings(s);
      setStartTime(s.default_start_time);
      setEndTime(s.default_end_time);
    });
    if (days.length > 0) {
      setSelectedDate(days[1]?.date || days[0].date); // Default a mañana
    }
  }, []);

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      await api.updateSettings(settings);
      setFeedback('Configuración global guardada.');
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Error al guardar configuración global.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveDayRule = async () => {
    if (!selectedDate) return;
    setSavingDay(true);
    try {
      const workDay: WorkDay = {
        date: selectedDate,
        is_available: isDayAvailable,
        start_time: startTime,
        end_time: endTime
      };
      await api.setWorkDay(workDay);
      setFeedback(`Reglas guardadas para el día ${selectedDate}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Error al configurar día de trabajo.');
    } finally {
      setSavingDay(false);
    }
  };

  if (!settings) {
    return <div className="p-8 text-center text-sm font-semibold text-brand-blue">Cargando reglas de agenda...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Feedback Alert */}
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. Configuración Global de Reglas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sliders className="w-5 h-5 text-brand-blue" />
          <h3 className="text-base font-extrabold text-brand-dark">1. Reglas Globales de Trabajo</h3>
        </div>

        <form onSubmit={handleSaveGlobalSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Duración por Trabajo (Intervalo)
            </label>
            <select
              value={settings.slot_duration_minutes}
              onChange={(e) => setSettings({ ...settings, slot_duration_minutes: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white outline-none focus:border-brand-blue"
            >
              <option value={90}>1.5 horas (90 minutos)</option>
              <option value={120}>2.0 horas (120 minutos) - Recomendado</option>
              <option value={180}>3.0 horas (180 minutos)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Máximo de Citas Diarias (Tope de Capacidad)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={settings.max_daily_appointments}
              onChange={(e) => setSettings({ ...settings, max_daily_appointments: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold bg-white outline-none focus:border-brand-blue"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-lightBlue text-white text-xs font-extrabold shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Reglas Globales</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Planificador "Mañana voy a trabajar" */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Calendar className="w-5 h-5 text-brand-orange" />
          <h3 className="text-base font-extrabold text-brand-dark">2. Planificador Específico de Días ("Mañana voy a trabajar")</h3>
        </div>

        {/* Selector de Fecha */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Selecciona el Día a Configurar
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {days.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedDate === d.date
                    ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {d.dayName} {d.dayNumber}
              </button>
            ))}
          </div>
          <p className="text-xs text-brand-blue font-bold mt-1 capitalize">
            {formatDateToSpanish(selectedDate)}
          </p>
        </div>

        {/* Switch Día Laborable */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <h4 className="text-sm font-extrabold text-brand-dark">¿Día Laborable Disponible?</h4>
            <p className="text-xs text-slate-500">Si está inactivo, ningún cliente podrá agendar citas este día.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsDayAvailable(!isDayAvailable)}
            className={`p-1 rounded-full transition-colors ${isDayAvailable ? 'text-brand-blue' : 'text-slate-300'}`}
          >
            {isDayAvailable ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
          </button>
        </div>

        {/* Horas Inicio / Fin para el día */}
        {isDayAvailable && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hora Inicio</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hora Cierre</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={savingDay}
            onClick={handleSaveDayRule}
            className="px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-extrabold shadow-glow-orange flex items-center gap-2 transition-all"
          >
            {savingDay ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Aplicar y Activar Horarios Públicos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
