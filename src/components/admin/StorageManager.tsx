import React, { useState } from 'react';
import { Database, Trash2, ShieldCheck, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export const StorageManager: React.FC = () => {
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<{ deletedPhotos: number; deletedOldAppointments: number } | null>(null);

  const handleRunCleanup = async () => {
    if (!confirm('¿Deseas ejecutar la limpieza manual ahora? Se eliminarán fotos de citas completadas y registros con más de 30 días.')) {
      return;
    }
    setCleaning(true);
    try {
      const res = await api.cleanupStorage();
      setResult(res);
    } catch {
      alert('Error al ejecutar la limpieza de almacenamiento.');
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-blue" />
          <h3 className="text-base font-extrabold text-brand-dark">
            Almacenamiento y Retención Automática (Cero Basura)
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Cron Trigger: 03:00 AM
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fotos en Cloudflare R2</span>
          </div>
          <p className="text-slate-500">
            Se borran inmediatamente al marcar la cita como <strong>"Completada"</strong> o al transcurrir la fecha agendada.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-brand-blue" />
            <span>Registros en Cloudflare D1</span>
          </div>
          <p className="text-slate-500">
            Citas de más de 30 días de antigüedad son purgadas automáticamente para mantener la base de datos ligera.
          </p>
        </div>
      </div>

      {result && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              Limpieza completada: <strong>{result.deletedPhotos} fotos purgadas</strong> y <strong>{result.deletedOldAppointments} registros antiguos eliminados</strong>.
            </span>
          </div>
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>La auto-limpieza se ejecuta todos los días a las 3:00 AM de forma desatendida.</span>
        </div>

        <button
          type="button"
          disabled={cleaning}
          onClick={handleRunCleanup}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          {cleaning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          <span>Ejecutar Limpieza Ahora</span>
        </button>
      </div>
    </div>
  );
};
