import React, { useState } from 'react';
import { Database, Trash2, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const StorageManager: React.FC = () => {
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<{ deletedPhotos: number; deletedOldAppointments: number } | null>(null);

  const handleRunCleanup = async () => {
    if (!confirm('¿Deseas ejecutar la purga manual ahora? Se eliminarán fotos de citas con más de 24 horas transcurridas o completadas (los registros se conservan para métricas).')) {
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
            Se borran automáticamente <strong>24 horas después</strong> de la hora agendada o al marcarla como <strong>"Completada"</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-brand-blue" />
            <span>Control Histórico en Cloudflare D1</span>
          </div>
          <p className="text-slate-500">
            Los registros se conservan de forma permanente para el control de métricas semanales, mensuales y anuales del administrador.
          </p>
        </div>
      </div>

      {result && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Purga completada: <strong>{result.deletedPhotos} fotos eliminadas de R2</strong>. Los registros históricos se preservan intactos.
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
          <span>Limpiar Fotos y Datos Antiguos Ahora</span>
        </button>
      </div>
    </div>
  );
};
