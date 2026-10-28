import { 
  Appointment, 
  AppointmentStatus, 
  AvailabilityResponse, 
  CreateAppointmentDto, 
  GlobalSettings, 
  TimeSlot, 
  WorkDay 
} from '../types/appointment';
import { getTodayDateString, getTomorrowDateString, formatTime12h } from '../utils/dateFormatter';

const STORAGE_KEYS = {
  SETTINGS: 'legacy_settings',
  WORK_DAYS: 'legacy_work_days',
  APPOINTMENTS: 'legacy_appointments'
};

const DEFAULT_SETTINGS: GlobalSettings = {
  slot_duration_minutes: 120, // 2 Horas
  max_daily_appointments: 4,
  default_start_time: '08:00',
  default_end_time: '17:00',
  admin_pin_hash: '1234'
};

function getInitialDemoAppointments(): Appointment[] {
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();

  return [
    {
      id: 'demo-app-1',
      client_name: 'Carlos Montero Vargas',
      client_phone: '8844-1234',
      client_address: 'San José, Escazú, 200m Norte de Multiplaza',
      service_type: 'Detección Especializada de Fugas',
      problem_description: 'El recibo de agua llegó con el triple del consumo normal. Se escucha sonido de agua corriendo bajo la losa de la cocina y el medidor sigue girando con llaves cerradas.',
      appointment_date: today,
      start_time: '08:00',
      end_time: '10:00',
      photo_keys: [
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80'
      ],
      photos_deleted: 0,
      status: 'confirmed',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'demo-app-2',
      client_name: 'Dra. Natalia Valverde',
      client_phone: '6102-9988',
      client_address: 'Heredia, San Joaquín de Flores, Residencial Real Santamaría',
      service_type: 'Rastreo y Diagnóstico de Tuberías',
      problem_description: 'Aparición de manchas de humedad y pintura abombada en la pared del pasillo. Requerimos mapear la tubería antes de remodelar para no dañarla.',
      appointment_date: today,
      start_time: '13:00',
      end_time: '15:00',
      photo_keys: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
      ],
      photos_deleted: 0,
      status: 'pending',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString()
    },
    {
      id: 'demo-app-3',
      client_name: 'Ing. Esteban Brenes',
      client_phone: '7014-5522',
      client_address: 'Alajuela, La Guácima, Condominio Los Reyes',
      service_type: 'Limpieza Técnica de Tuberías',
      problem_description: 'Disminución drástica de la presión de agua en los baños de la segunda planta por sarro y sedimentos acumulados.',
      appointment_date: tomorrow,
      start_time: '09:00',
      end_time: '11:00',
      photo_keys: [],
      photos_deleted: 0,
      status: 'confirmed',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];
}

class ApiService {
  private useLocalFallback = false;

  private getStored<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  constructor() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.setStored(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      this.setStored(STORAGE_KEYS.APPOINTMENTS, getInitialDemoAppointments());
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORK_DAYS)) {
      this.setStored(STORAGE_KEYS.WORK_DAYS, {});
    }
  }

  async verifyAdminPin(pin: string): Promise<boolean> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch('/api/admin/verify-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        });
        if (res.ok) {
          const data = await res.json();
          return data.valid === true;
        }
      }
    } catch {
      this.useLocalFallback = true;
    }
    const settings = this.getStored<GlobalSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    return pin === settings.admin_pin_hash;
  }

  async getSettings(): Promise<GlobalSettings> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch('/api/settings');
        if (res.ok) return await res.json();
      }
    } catch {
      this.useLocalFallback = true;
    }
    return this.getStored<GlobalSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  async updateSettings(settings: Partial<GlobalSettings>): Promise<GlobalSettings> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        if (res.ok) return await res.json();
      }
    } catch {
      this.useLocalFallback = true;
    }
    const current = this.getStored<GlobalSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const updated = { ...current, ...settings };
    this.setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  async getWorkDays(): Promise<Record<string, WorkDay>> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch('/api/work-days');
        if (res.ok) return await res.json();
      }
    } catch {
      this.useLocalFallback = true;
    }
    return this.getStored<Record<string, WorkDay>>(STORAGE_KEYS.WORK_DAYS, {});
  }

  async setWorkDay(workDay: WorkDay): Promise<void> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch('/api/work-days', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workDay)
        });
        if (res.ok) return;
      }
    } catch {
      this.useLocalFallback = true;
    }
    const days = this.getStored<Record<string, WorkDay>>(STORAGE_KEYS.WORK_DAYS, {});
    days[workDay.date] = workDay;
    this.setStored(STORAGE_KEYS.WORK_DAYS, days);
  }

  async getAvailability(date: string): Promise<AvailabilityResponse> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch(`/api/availability?date=${date}`);
        if (res.ok) return await res.json();
      }
    } catch {
      this.useLocalFallback = true;
    }

    const settings = this.getStored<GlobalSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const workDays = this.getStored<Record<string, WorkDay>>(STORAGE_KEYS.WORK_DAYS, {});
    const workDay = workDays[date];

    if (workDay && !workDay.is_available) {
      return {
        date,
        is_available: false,
        start_time: workDay.start_time || settings.default_start_time,
        end_time: workDay.end_time || settings.default_end_time,
        slots: [],
        total_booked: 0,
        max_allowed: 0,
        remaining_slots: 0
      };
    }

    const durationMinutes = workDay?.slot_duration_minutes || settings.slot_duration_minutes;
    const maxAppointments = workDay?.max_appointments || settings.max_daily_appointments;
    const startTimeStr = workDay?.start_time || settings.default_start_time;
    const endTimeStr = workDay?.end_time || settings.default_end_time;

    const allAppointments = this.getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    const dayAppointments = allAppointments.filter(
      (a) => a.appointment_date === date && a.status !== 'cancelled'
    );

    const isDayFull = dayAppointments.length >= maxAppointments;
    const slots: TimeSlot[] = [];

    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);
    
    let currentMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    while (currentMin + durationMinutes <= endMin) {
      const sH = Math.floor(currentMin / 60);
      const sM = currentMin % 60;
      const startSlot = `${String(sH).padStart(2, '0')}:${String(sM).padStart(2, '0')}`;

      const nextMin = currentMin + durationMinutes;
      const eH = Math.floor(nextMin / 60);
      const eM = nextMin % 60;
      const endSlot = `${String(eH).padStart(2, '0')}:${String(eM).padStart(2, '0')}`;

      const isBooked = dayAppointments.some((a) => a.start_time === startSlot);
      const isManuallyBlocked = workDay?.blocked_slots?.includes(startSlot);

      const isAvailableSlot = !isDayFull && !isBooked && !isManuallyBlocked;

      slots.push({
        start_time: startSlot,
        end_time: endSlot,
        label: `${formatTime12h(startSlot)} - ${formatTime12h(endSlot)}`,
        available: isAvailableSlot,
        reason: isDayFull ? 'Cupo diario completo' : (isBooked ? 'Ocupado' : (isManuallyBlocked ? 'Bloqueado por admin' : undefined))
      });

      currentMin += durationMinutes;
    }

    const remaining = Math.max(0, maxAppointments - dayAppointments.length);

    return {
      date,
      is_available: true,
      start_time: startTimeStr,
      end_time: endTimeStr,
      slots,
      total_booked: dayAppointments.length,
      max_allowed: maxAppointments,
      remaining_slots: remaining
    };
  }

  async getAppointments(): Promise<Appointment[]> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch('/api/appointments');
        if (res.ok) return await res.json();
      }
    } catch {
      this.useLocalFallback = true;
    }
    return this.getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  }

  async createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto)
        });
        if (res.ok) return await res.json();
      }
    } catch {
      this.useLocalFallback = true;
    }

    const newAppointment: Appointment = {
      id: 'app-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      client_name: dto.client_name,
      client_phone: dto.client_phone,
      client_address: dto.client_address,
      service_type: dto.service_type,
      problem_description: dto.problem_description,
      appointment_date: dto.appointment_date,
      start_time: dto.start_time,
      end_time: dto.end_time,
      photo_keys: dto.photos?.map(p => p.dataUrl) || [],
      photos_deleted: 0,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const current = this.getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    this.setStored(STORAGE_KEYS.APPOINTMENTS, [newAppointment, ...current]);
    return newAppointment;
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment | null> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch(`/api/appointments/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) return await res.json();
      }
    } catch {
      this.useLocalFallback = true;
    }

    const current = this.getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    let updatedApp: Appointment | null = null;
    const updated = current.map((app) => {
      if (app.id === id) {
        const photosDeleted = status === 'completed' ? 1 : app.photos_deleted;
        const photoKeys = status === 'completed' ? [] : app.photo_keys;
        updatedApp = { ...app, status, photos_deleted: photosDeleted, photo_keys: photoKeys };
        return updatedApp;
      }
      return app;
    });

    this.setStored(STORAGE_KEYS.APPOINTMENTS, updated);
    return updatedApp;
  }

  async cleanupStorage(): Promise<{ deletedPhotos: number; deletedOldAppointments: number }> {
    try {
      if (!this.useLocalFallback) {
        const res = await fetch('/api/admin/cleanup', { method: 'POST' });
        if (res.ok) return await res.json();
      }
    } catch {
      this.useLocalFallback = true;
    }

    const current = this.getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    const todayStr = getTodayDateString();

    let deletedPhotosCount = 0;
    let deletedAppsCount = 0;

    const remaining = current.filter((app) => {
      if (app.appointment_date < thirtyDaysAgoStr) {
        deletedAppsCount++;
        return false;
      }
      return true;
    }).map((app) => {
      if ((app.appointment_date < todayStr || app.status === 'completed') && app.photo_keys.length > 0) {
        deletedPhotosCount += app.photo_keys.length;
        return { ...app, photo_keys: [], photos_deleted: 1 };
      }
      return app;
    });

    this.setStored(STORAGE_KEYS.APPOINTMENTS, remaining);
    return { deletedPhotos: deletedPhotosCount, deletedOldAppointments: deletedAppsCount };
  }
}

export const api = new ApiService();
