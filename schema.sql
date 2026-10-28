-- ===================================================
-- Esquema Cloudflare D1 - Legacy Detección de Fugas
-- ===================================================

-- 1. Tabla de Configuración Global
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  slot_duration_minutes INTEGER NOT NULL DEFAULT 120,
  max_daily_appointments INTEGER NOT NULL DEFAULT 4,
  default_start_time TEXT NOT NULL DEFAULT '08:00',
  default_end_time TEXT NOT NULL DEFAULT '17:00',
  admin_pin_hash TEXT NOT NULL DEFAULT '1234'
);

-- Inicializar valores por defecto si no existen
INSERT OR IGNORE INTO settings (id, slot_duration_minutes, max_daily_appointments, default_start_time, default_end_time, admin_pin_hash)
VALUES (1, 120, 4, '08:00', '17:00', '1234');

-- 2. Tabla de Días de Trabajo / Disponibilidad Específica
CREATE TABLE IF NOT EXISTS work_days (
  date TEXT PRIMARY KEY, -- Formato YYYY-MM-DD
  is_available INTEGER NOT NULL DEFAULT 1, -- 1 = disponible, 0 = no laborable
  start_time TEXT, -- '08:00'
  end_time TEXT,   -- '17:00'
  custom_slot_minutes INTEGER,
  custom_max_appointments INTEGER,
  blocked_slots_json TEXT -- JSON array con horarios bloqueados manualmente ej. '["10:00", "14:00"]'
);

-- 3. Tabla de Citas
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY, -- UUID v4
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_address TEXT NOT NULL,
  service_type TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  appointment_date TEXT NOT NULL, -- YYYY-MM-DD
  appointment_time TEXT NOT NULL, -- HH:MM
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  photo_keys_json TEXT, -- JSON array con keys en R2: '["fuga_uuid_1.webp"]'
  photos_deleted INTEGER NOT NULL DEFAULT 0, -- 1 si las fotos ya fueron purgadas de R2
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para búsqueda rápida y ordenamiento
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);

-- 4. Tabla de Suscripciones Push (VAPID)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT NOT NULL UNIQUE,
  keys_json TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
