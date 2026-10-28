export type ServiceType = 
  | 'Detección Especializada de Fugas'
  | 'Rastreo y Diagnóstico de Tuberías'
  | 'Limpieza Técnica de Tuberías';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_address: string;
  service_type: ServiceType;
  problem_description: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM
  duration_minutes: number;
  photo_keys: string[]; // R2 keys or local base64 / blob URLs
  photos_deleted: number; // 0 or 1
  status: AppointmentStatus;
  created_at: string;
}

export interface CreateAppointmentDto {
  client_name: string;
  client_phone: string;
  client_address: string;
  service_type: ServiceType;
  problem_description: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes?: number;
  photos?: { name: string; dataUrl: string }[];
}

export interface WorkDay {
  date: string; // YYYY-MM-DD
  is_available: boolean;
  start_time: string; // '08:00'
  end_time: string;   // '17:00'
  custom_slot_minutes?: number | null;
  custom_max_appointments?: number | null;
  blocked_slots?: string[];
}

export interface GlobalSettings {
  slot_duration_minutes: number; // 90 (1.5h), 120 (2h), 180 (3h)
  max_daily_appointments: number; // 3, 4, 5...
  default_start_time: string; // '08:00'
  default_end_time: string;   // '17:00'
  admin_pin_hash: string;
}

export interface TimeSlot {
  time: string; // '08:00'
  available: boolean;
  reason?: string;
}

export interface AvailabilityResponse {
  date: string;
  is_available: boolean;
  slots: TimeSlot[];
  total_booked: number;
  max_allowed: number;
}
