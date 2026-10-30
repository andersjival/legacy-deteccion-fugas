import React, { useState } from 'react';
import { X, Check, CreditCard, Smartphone, Banknote, ArrowLeftRight, Plus, Trash2, Loader2, Split } from 'lucide-react';
import { PaymentMethod, PaymentSplit } from '../../types/appointment';
import { parsePaymentBreakdown, encodePaymentMethod, formatPaymentLabel } from '../../utils/paymentParser';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  clientName: string;
  serviceType: string;
  currentAmount?: number;
  currentMethod?: string;
  onSavePayment: (id: string, amount: number, method: string) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  clientName,
  serviceType,
  currentAmount = 0,
  currentMethod = 'sinpe',
  onSavePayment
}) => {
  // Inicializar splits a partir de lo guardado previamente
  const [splits, setSplits] = useState<PaymentSplit[]>(() => {
    const existing = parsePaymentBreakdown({ amount_collected: currentAmount, payment_method: currentMethod });
    if (existing.length > 0) return existing;
    return [{ method: (currentMethod as PaymentMethod) || 'sinpe', amount: currentAmount || 0 }];
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const totalAmount = splits.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  const handleSplitMethodChange = (index: number, newMethod: PaymentMethod) => {
    const updated = [...splits];
    updated[index].method = newMethod;
    setSplits(updated);
  };

  const handleSplitAmountChange = (index: number, val: number | string) => {
    const updated = [...splits];
    updated[index].amount = val === '' ? 0 : Number(val);
    setSplits(updated);
  };

  const handleAddSplit = () => {
    // Determinar siguiente método no usado o efectivo por defecto
    const usedMethods = splits.map((s) => s.method);
    const availableMethods: PaymentMethod[] = ['cash', 'transfer', 'sinpe', 'card'];
    const nextMethod = availableMethods.find((m) => !usedMethods.includes(m)) || 'cash';
    setSplits([...splits, { method: nextMethod, amount: 0 }]);
  };

  const handleRemoveSplit = (index: number) => {
    if (splits.length <= 1) return;
    setSplits(splits.filter((_, i) => i !== index));
  };

  const handleQuickAmount = (amount: number) => {
    // Si solo hay un split, le asigna el monto
    if (splits.length === 1) {
      setSplits([{ ...splits[0], amount }]);
    } else {
      // Si hay varios, suma o asigna al último con 0
      const emptyIdx = splits.findIndex((s) => Number(s.amount) === 0);
      if (emptyIdx !== -1) {
        const updated = [...splits];
        updated[emptyIdx].amount = amount;
        setSplits(updated);
      } else {
        const updated = [...splits];
        updated[0].amount = amount;
        setSplits(updated);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const validSplits = splits.filter((s) => Number(s.amount) > 0);
      const encoded = encodePaymentMethod(validSplits.length > 0 ? validSplits : splits);
      await onSavePayment(appointmentId, Number(totalAmount || 0), encoded);
      onClose();
    } catch {
      alert('Error al registrar el cobro de la cita.');
    } finally {
      setSaving(false);
    }
  };

  const quickAmounts = [25000, 35000, 45000, 60000, 75000, 100000];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
              ₡
            </div>
            <div>
              <h3 className="text-base font-black text-brand-dark leading-tight">
                Registrar Ingreso de Trabajo Finalizado
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[260px]">
                {clientName} • {serviceType}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Explicación de Registro Multi-Método */}
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Split className="w-3.5 h-3.5 text-emerald-600" />
                <span>Medios de Pago del Trabajo</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                {splits.length > 1 ? 'Pago Mixto' : 'Un solo medio'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Puedes registrar el total en un solo medio o dividirlo si el cliente pagó parte en Sinpe, efectivo o transferencia.
            </p>
          </div>

          {/* Lista de Filas de Cobro por Medio de Pago */}
          <div className="space-y-2.5">
            {splits.map((split, idx) => (
              <div 
                key={idx}
                className="bg-white border-2 border-slate-100 hover:border-slate-200 p-3 rounded-2xl space-y-2 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider">
                    Medio #{idx + 1}
                  </span>
                  {splits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSplit(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar este medio de pago"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Selector del Medio de Pago */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Medio de Ingreso
                    </label>
                    <select
                      value={split.method}
                      onChange={(e) => handleSplitMethodChange(idx, e.target.value as PaymentMethod)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-black text-xs text-brand-dark focus:bg-white focus:border-emerald-500 outline-none cursor-pointer"
                    >
                      <option value="sinpe">📱 Sinpe Móvil</option>
                      <option value="cash">💵 Efectivo</option>
                      <option value="transfer">🏛️ Transferencia Bancaria</option>
                      <option value="card">💳 Tarjeta Débito / Crédito</option>
                    </select>
                  </div>

                  {/* Input del Monto para este Medio */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Monto (₡ Colones)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-black text-xs">
                        ₡
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={500}
                        required
                        autoFocus={idx === 0}
                        value={split.amount || ''}
                        onChange={(e) => handleSplitAmountChange(idx, e.target.value)}
                        placeholder="25000"
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-brand-dark focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón para Agregar Otro Medio de Pago (Pago Mixto) */}
          {splits.length < 4 && (
            <button
              type="button"
              onClick={handleAddSplit}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Agregar Otro Medio de Pago a este Trabajo (Pago Mixto)</span>
            </button>
          )}

          {/* Pastillas de Montos Frecuentes */}
          <div>
            <span className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Montos Frecuentes de Servicio:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuickAmount(q)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                >
                  ₡{q.toLocaleString('es-CR')}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen Total y Desglose Visual */}
          <div className="bg-emerald-950 text-white p-4 rounded-2xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Total Cobrado del Trabajo:
              </span>
              <span className="text-xl font-black text-emerald-300 font-mono">
                ₡{totalAmount.toLocaleString('es-CR')}
              </span>
            </div>

            {/* Desglose en Línea */}
            <div className="text-[11px] text-slate-300 font-medium flex items-center gap-2 flex-wrap pt-0.5 border-t border-emerald-900/80">
              {splits.filter((s) => Number(s.amount) > 0).map((s, i) => (
                <span key={i} className="bg-white/10 px-2 py-0.5 rounded-md text-[10.5px] text-emerald-200 font-bold">
                  {formatPaymentLabel(s.method)}: ₡{Number(s.amount).toLocaleString('es-CR')}
                </span>
              ))}
              {splits.every((s) => Number(s.amount) <= 0) && (
                <span className="italic text-slate-400">Ingrese los montos para calcular el total</span>
              )}
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>
                {totalAmount > 0
                  ? `Guardar Cobro de ₡${totalAmount.toLocaleString('es-CR')} en Registros`
                  : 'Guardar Cobro en Registros'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
