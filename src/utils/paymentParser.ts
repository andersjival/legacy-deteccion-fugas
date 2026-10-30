import { PaymentMethod, PaymentSplit } from '../types/appointment';

export function parsePaymentBreakdown(appointment?: { amount_collected?: number; payment_method?: string } | null): PaymentSplit[] {
  if (!appointment || !appointment.amount_collected || appointment.amount_collected <= 0) {
    return [];
  }

  const raw = appointment.payment_method;
  if (!raw) {
    return [{ method: 'sinpe', amount: Number(appointment.amount_collected) }];
  }

  // Si viene como multi JSON
  if (raw.startsWith('multi:') || raw.startsWith('[')) {
    try {
      const jsonStr = raw.startsWith('multi:') ? raw.slice(6) : raw;
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .map((p: any) => ({
            method: normalizeMethod(p.method),
            amount: Number(p.amount || 0)
          }))
          .filter((p: PaymentSplit) => p.amount > 0);
      }
    } catch (e) {
      console.warn('Error parsing payment breakdown:', e);
    }
  }

  return [{ method: normalizeMethod(raw), amount: Number(appointment.amount_collected) }];
}

export function normalizeMethod(method?: string): PaymentMethod {
  if (!method) return 'sinpe';
  const m = method.toLowerCase().trim();
  if (m === 'cash' || m === 'efectivo') return 'cash';
  if (m === 'transfer' || m === 'transferencia') return 'transfer';
  if (m === 'card' || m === 'tarjeta') return 'card';
  return 'sinpe';
}

export function formatPaymentLabel(method: PaymentMethod): string {
  switch (method) {
    case 'cash':
      return 'Efectivo';
    case 'transfer':
      return 'Transferencia';
    case 'card':
      return 'Tarjeta';
    case 'sinpe':
    default:
      return 'Sinpe Móvil';
  }
}

export function formatPaymentSummary(appointment?: { amount_collected?: number; payment_method?: string } | null): string {
  const splits = parsePaymentBreakdown(appointment);
  if (splits.length === 0) return 'Sin cobro';
  if (splits.length === 1) {
    return `${formatPaymentLabel(splits[0].method)}`;
  }
  return splits
    .map((s) => `₡${s.amount.toLocaleString('es-CR')} ${formatPaymentLabel(s.method)}`)
    .join(' + ');
}

export function encodePaymentMethod(splits: PaymentSplit[]): string {
  const valid = splits.filter((s) => Number(s.amount) > 0);
  if (valid.length === 0) return 'sinpe';
  if (valid.length === 1) return valid[0].method;
  return 'multi:' + JSON.stringify(valid);
}
