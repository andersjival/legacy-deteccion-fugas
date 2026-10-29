export type ServiceType = string;

export interface ServiceItem {
  id: string;
  title: string;
  badge?: string;
  description?: string;
  price?: number;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  { id: 'srv_1', title: 'Detección Especializada de Fugas', badge: 'Alta Precisión', description: 'Localización acústica y térmica de fugas ocultas', price: 45000 },
  { id: 'srv_2', title: 'Rastreo y Diagnóstico de Tuberías', badge: 'Sin Romper', description: 'Mapeo electromagnético y gas trazador', price: 35000 },
  { id: 'srv_3', title: 'Limpieza Técnica de Tuberías', badge: 'Desincrustación', description: 'Eliminación profunda de sarro y sedimentos', price: 25000 }
];

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentMethod = 'sinpe' | 'card' | 'cash';

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_address: string;
  latitude?: number | null;
  longitude?: number | null;
  service_type: ServiceType;
  problem_description: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM ej. '08:00'
  end_time: string;   // HH:MM ej. '10:00'
  duration_minutes?: number;
  photo_keys: string[]; // R2 keys or local base64 / blob URLs
  photos_deleted: number; // 0 or 1
  amount_collected?: number; // Monto cobrado en Colones
  payment_method?: PaymentMethod | string; // 'sinpe' | 'card' | 'cash'
  status: AppointmentStatus;
  created_at: string;
}

export interface CreateAppointmentDto {
  client_name: string;
  client_phone: string;
  client_address: string;
  latitude?: number | null;
  longitude?: number | null;
  service_type: ServiceType;
  problem_description: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  photos?: { name: string; dataUrl: string }[];
}

export interface WorkDay {
  date: string; // YYYY-MM-DD
  is_available: boolean;
  start_time: string; // '08:00'
  end_time: string;   // '17:00'
  slot_duration_minutes?: number | null;
  max_appointments?: number | null;
  blocked_slots?: string[];
}

export interface GlobalSettings {
  slot_duration_minutes: number;
  max_daily_appointments: number;
  default_start_time: string;
  default_end_time: string;
  admin_pin_hash: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  label: string;
  available: boolean;
  reason?: string;
}

export interface AvailabilityResponse {
  date: string;
  is_available: boolean;
  start_time: string;
  end_time: string;
  slots: TimeSlot[];
  total_booked: number;
  max_allowed: number;
  remaining_slots: number;
}
