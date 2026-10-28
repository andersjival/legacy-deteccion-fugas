import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Check, Save, Sliders, ToggleLeft, ToggleRight, Loader2, Ban } from 'lucide-react';
import { GlobalSettings, WorkDay } from '../../types/appointment';
import { api } from '../../services/api';
import { getNextDays, formatDateToSpanish, formatTime12h } from '../../utils/dateFormatter';

export const AvailabilityManager: React.FC = () => {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isDayAvailable, setIsDayAvailable] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
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
      setSelectedDate(days[1]?.date || days[0].date);
    }
  }, []);

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      await api.updateSettings(settings);
      setFeedback('Reglas globales guardadas.');
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Error al guardar configuración global.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleBlockSlot = (startSlot: string) => {
    setBlockedSlots((prev) =>
      prev.includes(startSlot) ? prev.filter((s) => s !== startSlot) : [...prev, startSlot]
    );
  };

  const handleSaveDayRule = async () => {
    if (!selectedDate) return;
    setSavingDay(true);
    try {
      const workDay: WorkDay = {
        date: selectedDate,
        is_available: isDayAvailable,
        start_time: startTime,
        end_time: endTime,
        blocked_slots: blockedSlots
      };
      await api.setWorkDay(workDay);
      setFeedback(`Horarios activados para el día ${selectedDate}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      alert('Error al configurar día de trabajo.');
    } finally {
      setSavingDay(false);
    }
  };

  // Previsualizar slots para el día
  const previewSlots = [];
  if (settings && isDayAvailable) {
    const duration = settings.slot_duration_minutes;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    let cur = startH * 60 + startM;
    const fin = endH * 60 + endM;

    while (cur + duration <= fin) {
      const sH = Math.floor(cur / 60);
      const sM = cur % 60;
      const slotStart = `${String(sH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`;
      const eH = Math.floor((cur + duration) / 60);
      const eM = (cur + duration) % 60;
      const slotEnd = `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`;
      previewSlots.push({ start: slotStart, end: slotEnd });
      cur += duration;
    }
  }

  if (!settings) {
    return <div className="p-8 text-center text-sm font-semibold text-brand-blue">Cargando reglas de agenda...</div>;
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. Configuración Global de Reglas */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Sliders className="w-4 h-4 text-brand-blue" />
          <h3 className="text-sm font-extrabold text-brand-dark">1. Reglas Globales de Trabajo</h3>
        </div>

        <form onSubmit={handleSaveGlobalSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Duración por Trabajo (Intervalo de Bloques)
            </label>
            <select
              value={settings.slot_duration_minutes}
              onChange={(e) => setSettings({ ...settings, slot_duration_minutes: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-none focus:border-brand-blue"
            >
              <option value={90}>Cada 1.5 horas (90 min)</option>
              <option value={120}>Cada 2 horas (120 min) - Estándar</option>
              <option value={180}>Cada 3 horas (180 min)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Límite Máximo de Citas por Día
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={settings.max_daily_appointments}
              onChange={(e) => setSettings({ ...settings, max_daily_appointments: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-none focus:border-brand-blue"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-lightBlue text-white text-xs font-extrabold shadow-sm flex items-center gap-2 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Reglas Globales</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Planificador "Mañana voy a trabajar" */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Calendar className="w-4 h-4 text-brand-orange" />
          <h3 className="text-sm font-extrabold text-brand-dark">2. Planificador Específico ("Mañana voy a trabajar")</h3>
        </div>

        {/* Selector de Fecha */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            Selecciona el Día
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {days.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedDate(d.date)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
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

        {/* Switch Habilitar Día */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <h4 className="text-xs font-extrabold text-brand-dark">Habilitar día para agendamiento</h4>
            <p className="text-[11px] text-slate-500">Controla si los clientes pueden agendar este día.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsDayAvailable(!isDayAvailable)}
            className={`p-1 transition-colors ${isDayAvailable ? 'text-brand-blue' : 'text-slate-300'}`}
          >
            {isDayAvailable ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
          </button>
        </div>

        {/* Horas Inicio y Cierre */}
        {isDayAvailable && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hora Inicio</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hora Cierre</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Bloqueo Manual de Horas Específicas */}
            <div>
              <p className="text-xs font-bold text-slate-700 uppercase mb-2">
                Bloqueo Manual de Horas Específicas (Toca un bloque para bloquear/liberar):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {previewSlots.map((s) => {
                  const isBlocked = blockedSlots.includes(s.start);
                  return (
                    <button
                      key={s.start}
                      type="button"
                      onClick={() => handleToggleBlockSlot(s.start)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isBlocked
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <span>{formatTime12h(s.start)} - {formatTime12h(s.end)}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase bg-white">
                        {isBlocked ? 'Bloqueado' : 'Libre'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={savingDay}
            onClick={handleSaveDayRule}
            className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-extrabold shadow-glow-orange flex items-center gap-2 transition-all"
          >
            {savingDay ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>Aplicar y Activar Horarios Públicos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
