import React from 'react';
import { Calendar, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Appointment } from '../../types/appointment';
import { getTodayDateString } from '../../utils/dateFormatter';

interface KPICardsProps {
  appointments: Appointment[];
}

export const KPICards: React.FC<KPICardsProps> = ({ appointments }) => {
  const todayStr = getTodayDateString();

  // Calcular citas de Hoy
  const todayApps = appointments.filter((a) => a.appointment_date === todayStr);
  const todayPending = todayApps.filter((a) => a.status === 'pending').length;

  // Calcular citas de la semana (próximos 7 días)
  const now = new Date();
  const weekLimit = new Date();
  weekLimit.setDate(weekLimit.getDate() + 7);
  const weekLimitStr = weekLimit.toISOString().split('T')[0];

  const weekApps = appointments.filter((a) => {
    return a.appointment_date >= todayStr && a.appointment_date <= weekLimitStr;
  });

  // Calcular citas del mes actual
  const currentYearMonth = todayStr.substring(0, 7); // 'YYYY-MM'
  const monthApps = appointments.filter((a) => a.appointment_date.startsWith(currentYearMonth));

  const kpis = [
    {
      title: 'Citas Hoy',
      count: todayApps.length,
      detail: `${todayPending} pendientes de confirmación`,
      icon: Clock,
      color: 'bg-blue-500 text-white',
      badgeColor: todayPending > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
    },
    {
      title: 'Esta Semana',
      count: weekApps.length,
      detail: 'Próximos 7 días programados',
      icon: Calendar,
      color: 'bg-brand-blue text-white',
      badgeColor: 'bg-blue-100 text-brand-blue'
    },
    {
      title: 'Este Mes',
      count: monthApps.length,
      detail: 'Total de servicios en el mes',
      icon: TrendingUp,
      color: 'bg-brand-orange text-white',
      badgeColor: 'bg-orange-100 text-brand-orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-brand-slate uppercase tracking-wider">{kpi.title}</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark my-1">
                {kpi.count}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500">{kpi.detail}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${kpi.color} flex items-center justify-center shadow-sm shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
