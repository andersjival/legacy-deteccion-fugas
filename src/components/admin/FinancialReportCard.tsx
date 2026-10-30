import React, { useState, useEffect } from 'react';
import { DollarSign, Smartphone, CreditCard, Banknote, Calendar, TrendingUp, Plus, Receipt, Fuel, Utensils, Trash2, X, Upload, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { getTodayDateString } from '../../utils/dateFormatter';

interface FinancialReportCardProps {
  appointments: Appointment[];
}

export interface OperationalExpense {
  id: string;
  date: string;
  amount: number;
  category: 'gasolina' | 'alimentacion' | 'peajes' | 'materiales' | 'otro';
  notes: string;
  receiptImage?: string;
  createdAt: string;
}

const EXPENSES_STORAGE_KEY = 'royalty_operational_expenses_v1';

export const FinancialReportCard: React.FC<FinancialReportCardProps> = ({ appointments }) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [expenses, setExpenses] = useState<OperationalExpense[]>(() => {
    try {
      const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [showExpensesList, setShowExpensesList] = useState(false);

  // Formulario nuevo gasto
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expCategory, setExpCategory] = useState<'gasolina' | 'alimentacion' | 'peajes' | 'materiales' | 'otro'>('gasolina');
  const [expNotes, setExpNotes] = useState('');
  const [expReceipt, setExpReceipt] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {}
  }, [expenses]);

  const todayStr = getTodayDateString();

  // 1. Filtrar Citas de Hoy
  const todayAppointments = appointments.filter((a) => a.appointment_date === todayStr);

  // 2. Filtrar Citas de Esta Semana (Lunes a Domingo)
  const d = new Date(todayStr + 'T12:00:00');
  const day = d.getDay();
  const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const mondayStr = monday.toISOString().split('T')[0];
  const sundayStr = sunday.toISOString().split('T')[0];

  const weekAppointments = appointments.filter(
    (a) => a.appointment_date >= mondayStr && a.appointment_date <= sundayStr
  );

  // 3. Filtrar Citas de Este Mes
  const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM
  const monthAppointments = appointments.filter(
    (a) => a.appointment_date && a.appointment_date.startsWith(currentMonthStr)
  );

  const activeList = period === 'today' 
    ? todayAppointments 
    : (period === 'week' ? weekAppointments : monthAppointments);

  // Totales de Ingresos
  const totalAmount = activeList.reduce((acc, a) => acc + (Number(a.amount_collected) || 0), 0);
  
  const sinpeList = activeList.filter((a) => (a.payment_method || 'sinpe') === 'sinpe' && (a.amount_collected || 0) > 0);
  const totalSinpe = sinpeList.reduce((acc, a) => acc + Number(a.amount_collected || 0), 0);

  const cardList = activeList.filter((a) => a.payment_method === 'card' && (a.amount_collected || 0) > 0);
  const totalCard = cardList.reduce((acc, a) => acc + Number(a.amount_collected || 0), 0);

  const cashList = activeList.filter((a) => a.payment_method === 'cash' && (a.amount_collected || 0) > 0);
  const totalCash = cashList.reduce((acc, a) => acc + Number(a.amount_collected || 0), 0);

  const billedCount = activeList.filter((a) => (a.amount_collected || 0) > 0).length;

  // Filtrar Gastos según el período activo
  const activeExpenses = expenses.filter((exp) => {
    if (period === 'today') return exp.date === todayStr;
    if (period === 'week') return exp.date >= mondayStr && exp.date <= sundayStr;
    return exp.date.startsWith(currentMonthStr);
  });

  const totalExpenses = activeExpenses.reduce((acc, exp) => acc + (Number(exp.amount) || 0), 0);
  const netProfit = totalAmount - totalExpenses;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setExpReceipt(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) return;
    const newExp: OperationalExpense = {
      id: `exp_${Date.now()}`,
      date: todayStr,
      amount: Number(expAmount),
      category: expCategory,
      notes: expNotes.trim(),
      receiptImage: expReceipt || undefined,
      createdAt: new Date().toISOString()
    };
    setExpenses([newExp, ...expenses]);
    setExpAmount('');
    setExpNotes('');
    setExpReceipt(null);
    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('¿Eliminar este registro de gasto?')) {
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  const periodLabel = period === 'today' 
    ? 'Hoy' 
    : (period === 'week' ? 'Esta Semana' : 'Este Mes');

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-soft space-y-4">
      {/* Selector de Período: Hoy vs Esta Semana vs Este Mes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm">
            ₡
          </div>
          <div>
            <span className="text-xs font-black text-brand-dark uppercase tracking-wide block">
              Control de Ingresos y Gastos
            </span>
            <span className="text-[10.5px] text-slate-500 font-semibold">
              Auditoría financiera en tiempo real
            </span>
          </div>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-xl text-[11px] font-black self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriod('today')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              period === 'today'
                ? 'bg-white text-brand-dark shadow-xs'
                : 'text-slate-500 hover:text-brand-dark'
            }`}
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              period === 'week'
                ? 'bg-white text-brand-dark shadow-xs'
                : 'text-slate-500 hover:text-brand-dark'
            }`}
          >
            Esta Semana
          </button>
          <button
            type="button"
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              period === 'month'
                ? 'bg-white text-brand-dark shadow-xs'
                : 'text-slate-500 hover:text-brand-dark'
            }`}
          >
            Este Mes
          </button>
        </div>
      </div>

      {/* Tarjeta de Resumen Financiero: Ingresos vs Gastos vs Utilidad Neta */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="bg-emerald-50/80 border border-emerald-200/70 p-3.5 rounded-2xl">
          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
            Ingresos ({periodLabel})
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-900 tracking-tight mt-0.5">
            ₡{totalAmount.toLocaleString('es-CR')}
          </div>
          <span className="text-[10px] font-bold text-emerald-700">
            {billedCount} de {activeList.length} trabajos cobrados
          </span>
        </div>

        <div className="bg-rose-50/80 border border-rose-200/70 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider block">
              Gastos ({periodLabel})
            </span>
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(true)}
              className="text-[10px] font-black bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>Gasto</span>
            </button>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-900 tracking-tight mt-0.5">
            ₡{totalExpenses.toLocaleString('es-CR')}
          </div>
          <span className="text-[10px] font-bold text-rose-700">
            {activeExpenses.length} comprobantes registrados
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 text-white p-3.5 rounded-2xl">
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
            Utilidad Neta Líquida
          </span>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            ₡{netProfit.toLocaleString('es-CR')}
          </div>
          <span className="text-[10px] font-bold text-slate-300">
            Ingresos menos gastos operativos
          </span>
        </div>
      </div>

      {/* Desglose de Ingresos por Método de Pago */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider block">
          Desglose de Cobros por Método ({periodLabel})
        </span>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {/* Sinpe Móvil */}
          <div className="bg-emerald-50/70 p-2.5 rounded-2xl border border-emerald-200/60">
            <div className="flex items-center justify-between text-emerald-800 font-black text-[10px] mb-1">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-emerald-600" />
                <span>Sinpe Móvil</span>
              </span>
              <span className="text-[9px] bg-emerald-200/70 px-1.5 py-0.2 rounded-md font-bold">
                {sinpeList.length}
              </span>
            </div>
            <div className="font-black text-xs sm:text-sm text-emerald-900 leading-tight">
              ₡{totalSinpe.toLocaleString('es-CR')}
            </div>
          </div>

          {/* Tarjeta */}
          <div className="bg-blue-50/70 p-2.5 rounded-2xl border border-blue-200/60">
            <div className="flex items-center justify-between text-blue-800 font-black text-[10px] mb-1">
              <span className="flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-blue-600" />
                <span>Tarjeta</span>
              </span>
              <span className="text-[9px] bg-blue-200/70 px-1.5 py-0.2 rounded-md font-bold">
                {cardList.length}
              </span>
            </div>
            <div className="font-black text-xs sm:text-sm text-blue-900 leading-tight">
              ₡{totalCard.toLocaleString('es-CR')}
            </div>
          </div>

          {/* Efectivo */}
          <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200/60">
            <div className="flex items-center justify-between text-amber-800 font-black text-[10px] mb-1">
              <span className="flex items-center gap-1">
                <Banknote className="w-3 h-3 text-amber-600" />
                <span>Efectivo</span>
              </span>
              <span className="text-[9px] bg-amber-200/70 px-1.5 py-0.2 rounded-md font-bold">
                {cashList.length}
              </span>
            </div>
            <div className="font-black text-xs sm:text-sm text-amber-900 leading-tight">
              ₡{totalCash.toLocaleString('es-CR')}
            </div>
          </div>
        </div>
      </div>

      {/* Sección Desplegable de Comprobantes de Gastos de Ruta */}
      <div className="pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowExpensesList(!showExpensesList)}
            className="text-xs font-bold text-slate-600 hover:text-brand-dark flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            <span>Comprobantes de Gastos ({activeExpenses.length})</span>
            {showExpensesList ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3 h-3" />
            <span>+ Subir Factura / Gasto</span>
          </button>
        </div>

        {showExpensesList && (
          <div className="pt-2 space-y-2">
            {activeExpenses.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-2xl text-center">
                No hay gastos registrados en este período ({periodLabel}).
              </p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {activeExpenses.map((exp) => (
                  <div key={exp.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        {exp.category === 'gasolina' ? (
                          <Fuel className="w-3.5 h-3.5 text-amber-600" />
                        ) : exp.category === 'alimentacion' ? (
                          <Utensils className="w-3.5 h-3.5 text-orange-600" />
                        ) : (
                          <Receipt className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-brand-dark capitalize">
                            {exp.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • {exp.date}
                          </span>
                        </div>
                        {exp.notes && (
                          <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {exp.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-rose-700 text-xs sm:text-sm">
                        -₡{exp.amount.toLocaleString('es-CR')}
                      </span>
                      {exp.receiptImage && (
                        <button
                          type="button"
                          onClick={() => {
                            const w = window.open('');
                            w?.document.write(`<img src="${exp.receiptImage}" style="max-width:100%;height:auto;margin:auto;display:block;" />`);
                          }}
                          className="text-[10px] font-bold text-brand-blue hover:underline cursor-pointer bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200"
                          title="Ver comprobante adjunto"
                        >
                          Ver Doc
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="text-slate-300 hover:text-red-500 p-1 rounded-lg cursor-pointer transition-colors"
                        title="Eliminar gasto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Registrar Gasto con Subida de Comprobante */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-brand-dark">
                    Registrar Gasto Operativo
                  </h4>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Gasolina, alimentación, peajes o insumos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3.5 text-xs">
              {/* Categoría */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Categoría del Gasto
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setExpCategory('gasolina')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1 ${
                      expCategory === 'gasolina'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Fuel className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[10px]">Gasolina</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpCategory('alimentacion')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1 ${
                      expCategory === 'alimentacion'
                        ? 'border-orange-500 bg-orange-50 text-orange-950 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-[10px]">Alimentación</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpCategory('peajes')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1 ${
                      expCategory === 'peajes'
                        ? 'border-blue-500 bg-blue-50 text-blue-950 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px]">Peajes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpCategory('materiales')}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1 ${
                      expCategory === 'materiales'
                        ? 'border-purple-500 bg-purple-50 text-purple-950 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-[10px]">Materiales</span>
                  </button>
                </div>
              </div>

              {/* Monto */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Monto del Gasto (₡)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₡</span>
                  <input
                    type="number"
                    min={1}
                    required
                    autoFocus
                    placeholder="15000"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 rounded-2xl border border-slate-200 font-black text-sm text-brand-dark focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              {/* Detalle / Notas */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Detalle / Proveedor (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Tanque lleno bomba Delta / Almuerzo técnico"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl border border-slate-200 text-xs text-brand-dark focus:border-rose-500 outline-none"
                />
              </div>

              {/* Subir Comprobante / Foto de Factura */}
              <div>
                <label className="block text-[11px] font-black text-slate-700 uppercase mb-1">
                  Subir Documento o Foto de Factura
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-rose-400 p-3 rounded-2xl text-center transition-colors">
                  {expReceipt ? (
                    <div className="flex items-center justify-between gap-2">
                      <img src={expReceipt} alt="Comprobante" className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                      <span className="text-[11px] text-emerald-700 font-bold">✓ Comprobante listo</span>
                      <button
                        type="button"
                        onClick={() => setExpReceipt(null)}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block space-y-1">
                      <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                      <span className="text-[11px] font-bold text-slate-600 block">
                        Tomar foto o subir factura desde el teléfono
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Gasto en la Aplicación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
