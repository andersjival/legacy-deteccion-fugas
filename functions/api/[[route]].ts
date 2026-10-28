import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Bindings = {
  DB?: D1Database;
  PHOTOS_BUCKET?: R2Bucket;
  ADMIN_PIN?: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

// Health Check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    edge: 'Cloudflare Pages Functions'
  });
});

// 1. Verificación de PIN Admin
app.post('/admin/verify-pin', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const pin = body.pin;
  const configuredPin = c.env.ADMIN_PIN || '1234';

  if (c.env.DB) {
    try {
      const res = await c.env.DB.prepare('SELECT admin_pin_hash FROM settings WHERE id = 1').first<{ admin_pin_hash: string }>();
      if (res?.admin_pin_hash) {
        return c.json({ valid: pin === res.admin_pin_hash });
      }
    } catch (e) {
      console.warn('D1 PIN query error:', e);
    }
  }

  return c.json({ valid: pin === configuredPin });
});

// 2. Configuración Global (Settings)
app.get('/settings', async (c) => {
  if (c.env.DB) {
    try {
      const row = await c.env.DB.prepare('SELECT * FROM settings WHERE id = 1').first();
      if (row) return c.json(row);
    } catch (e) {
      console.warn('D1 settings error:', e);
    }
  }

  return c.json({
    slot_duration_minutes: 120,
    max_daily_appointments: 4,
    default_start_time: '08:00',
    default_end_time: '17:00',
    admin_pin_hash: c.env.ADMIN_PIN || '1234'
  });
});

app.put('/settings', async (c) => {
  const body = await c.req.json();
  if (c.env.DB) {
    try {
      await c.env.DB.prepare(`
        UPDATE settings 
        SET slot_duration_minutes = ?, max_daily_appointments = ?, default_start_time = ?, default_end_time = ?
        WHERE id = 1
      `).bind(
        body.slot_duration_minutes || 120,
        body.max_daily_appointments || 4,
        body.default_start_time || '08:00',
        body.default_end_time || '17:00'
      ).run();
    } catch (e) {
      console.warn('D1 settings update error:', e);
    }
  }
  return c.json({ success: true, ...body });
});

// 3. Días de Trabajo y Disponibilidad
app.get('/work-days', async (c) => {
  if (c.env.DB) {
    try {
      const { results } = await c.env.DB.prepare('SELECT * FROM work_days').all();
      const map: Record<string, unknown> = {};
      results?.forEach((r: any) => {
        map[r.date] = {
          ...r,
          is_available: r.is_available === 1,
          blocked_slots: r.blocked_slots_json ? JSON.parse(r.blocked_slots_json) : []
        };
      });
      return c.json(map);
    } catch (e) {
      console.warn('D1 work-days error:', e);
    }
  }
  return c.json({});
});

app.post('/work-days', async (c) => {
  const body = await c.req.json();
  if (c.env.DB) {
    try {
      await c.env.DB.prepare(`
        INSERT INTO work_days (date, is_available, start_time, end_time, custom_slot_minutes, custom_max_appointments, blocked_slots_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
          is_available = excluded.is_available,
          start_time = excluded.start_time,
          end_time = excluded.end_time,
          custom_slot_minutes = excluded.custom_slot_minutes,
          custom_max_appointments = excluded.custom_max_appointments,
          blocked_slots_json = excluded.blocked_slots_json
      `).bind(
        body.date,
        body.is_available ? 1 : 0,
        body.start_time || '08:00',
        body.end_time || '17:00',
        body.custom_slot_minutes || null,
        body.custom_max_appointments || null,
        body.blocked_slots ? JSON.stringify(body.blocked_slots) : null
      ).run();
    } catch (e) {
      console.warn('D1 work-days save error:', e);
    }
  }
  return c.json({ success: true, workDay: body });
});

// 4. Consulta de Disponibilidad de Horarios
app.get('/availability', async (c) => {
  const date = c.req.query('date') || new Date().toISOString().split('T')[0];

  let durationMinutes = 120;
  let maxAppointments = 4;
  let startTime = '08:00';
  let endTime = '17:00';
  let isAvailable = true;
  let blockedSlots: string[] = [];
  const bookedSlots: string[] = [];

  if (c.env.DB) {
    try {
      // Leer settings globales
      const settings = await c.env.DB.prepare('SELECT * FROM settings WHERE id = 1').first<any>();
      if (settings) {
        durationMinutes = settings.slot_duration_minutes;
        maxAppointments = settings.max_daily_appointments;
        startTime = settings.default_start_time;
        endTime = settings.default_end_time;
      }

      // Leer regla específica del día
      const workDay = await c.env.DB.prepare('SELECT * FROM work_days WHERE date = ?').bind(date).first<any>();
      if (workDay) {
        isAvailable = workDay.is_available === 1;
        if (workDay.start_time) startTime = workDay.start_time;
        if (workDay.end_time) endTime = workDay.end_time;
        if (workDay.custom_slot_minutes) durationMinutes = workDay.custom_slot_minutes;
        if (workDay.custom_max_appointments) maxAppointments = workDay.custom_max_appointments;
        if (workDay.blocked_slots_json) blockedSlots = JSON.parse(workDay.blocked_slots_json);
      }

      // Leer citas ya agendadas
      const { results } = await c.env.DB.prepare(
        "SELECT appointment_time FROM appointments WHERE appointment_date = ? AND status != 'cancelled'"
      ).bind(date).all();

      results?.forEach((r: any) => bookedSlots.push(r.appointment_time));
    } catch (e) {
      console.warn('D1 availability check error:', e);
    }
  }

  if (!isAvailable) {
    return c.json({
      date,
      is_available: false,
      slots: [],
      total_booked: bookedSlots.length,
      max_allowed: 0
    });
  }

  // Generar bloques según duración
  const isDayFull = bookedSlots.length >= maxAppointments;
  const slots: Array<{ time: string; available: boolean; reason?: string }> = [];

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let currentMin = startH * 60 + startM;
  const endMin = endH * 60 + endM;

  while (currentMin + durationMinutes <= endMin) {
    const h = Math.floor(currentMin / 60);
    const m = currentMin % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const isBooked = bookedSlots.includes(timeStr);
    const isManuallyBlocked = blockedSlots.includes(timeStr);

    slots.push({
      time: timeStr,
      available: !isDayFull && !isBooked && !isManuallyBlocked,
      reason: isDayFull ? 'Cupo diario alcanzado' : (isBooked ? 'Horario reservado' : (isManuallyBlocked ? 'No disponible' : undefined))
    });

    currentMin += durationMinutes;
  }

  return c.json({
    date,
    is_available: true,
    slots,
    total_booked: bookedSlots.length,
    max_allowed: maxAppointments
  });
});

// 5. Citas (Appointments)
app.get('/appointments', async (c) => {
  if (c.env.DB) {
    try {
      const { results } = await c.env.DB.prepare(
        'SELECT * FROM appointments ORDER BY appointment_date ASC, appointment_time ASC'
      ).all();

      const list = results?.map((r: any) => ({
        ...r,
        photo_keys: r.photo_keys_json ? JSON.parse(r.photo_keys_json) : []
      }));
      return c.json(list || []);
    } catch (e) {
      console.warn('D1 get appointments error:', e);
    }
  }
  return c.json([]);
});

app.post('/appointments', async (c) => {
  const body = await c.req.json();
  const id = 'app_' + crypto.randomUUID();
  const photoKeys: string[] = [];

  // Si hay fotos y R2 está enlazado, guardar en R2
  if (body.photos && Array.isArray(body.photos) && c.env.PHOTOS_BUCKET) {
    for (let i = 0; i < Math.min(body.photos.length, 3); i++) {
      const photo = body.photos[i];
      if (photo.dataUrl) {
        try {
          const base64Data = photo.dataUrl.split(',')[1];
          const binary = Uint8Array.from(atob(base64Data), (char) => char.charCodeAt(0));
          const key = `fuga_${id}_${i + 1}.webp`;
          await c.env.PHOTOS_BUCKET.put(key, binary, {
            httpMetadata: { contentType: 'image/webp' }
          });
          photoKeys.push(`/api/photos/${key}`);
        } catch (e) {
          console.warn('R2 photo upload error:', e);
          photoKeys.push(photo.dataUrl);
        }
      }
    }
  } else if (body.photos && Array.isArray(body.photos)) {
    // Si no hay R2 en dev, guardar base64
    body.photos.forEach((p: any) => photoKeys.push(p.dataUrl));
  }

  if (c.env.DB) {
    try {
      await c.env.DB.prepare(`
        INSERT INTO appointments (
          id, client_name, client_phone, client_address, service_type, problem_description,
          appointment_date, appointment_time, duration_minutes, photo_keys_json, photos_deleted, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending')
      `).bind(
        id,
        body.client_name,
        body.client_phone,
        body.client_address,
        body.service_type,
        body.problem_description,
        body.appointment_date,
        body.appointment_time,
        body.duration_minutes || 120,
        JSON.stringify(photoKeys)
      ).run();
    } catch (e) {
      console.warn('D1 insert appointment error:', e);
    }
  }

  const created = {
    id,
    client_name: body.client_name,
    client_phone: body.client_phone,
    client_address: body.client_address,
    service_type: body.service_type,
    problem_description: body.problem_description,
    appointment_date: body.appointment_date,
    appointment_time: body.appointment_time,
    duration_minutes: body.duration_minutes || 120,
    photo_keys: photoKeys,
    photos_deleted: 0,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  return c.json(created, 201);
});

// 6. Actualización de Estado (Purga fotos de R2 si se completa)
app.patch('/appointments/:id/status', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const status = body.status;

  if (c.env.DB) {
    try {
      if (status === 'completed' && c.env.PHOTOS_BUCKET) {
        // Obtener fotos para borrarlas de R2
        const appRow = await c.env.DB.prepare('SELECT photo_keys_json FROM appointments WHERE id = ?').bind(id).first<any>();
        if (appRow?.photo_keys_json) {
          const keys: string[] = JSON.parse(appRow.photo_keys_json);
          for (const k of keys) {
            const cleanKey = k.replace('/api/photos/', '');
            await c.env.PHOTOS_BUCKET.delete(cleanKey).catch(() => {});
          }
        }

        await c.env.DB.prepare(
          "UPDATE appointments SET status = ?, photos_deleted = 1, photo_keys_json = '[]' WHERE id = ?"
        ).bind(status, id).run();
      } else {
        await c.env.DB.prepare('UPDATE appointments SET status = ? WHERE id = ?').bind(status, id).run();
      }

      const updated = await c.env.DB.prepare('SELECT * FROM appointments WHERE id = ?').bind(id).first<any>();
      if (updated) {
        return c.json({
          ...updated,
          photo_keys: updated.photo_keys_json ? JSON.parse(updated.photo_keys_json) : []
        });
      }
    } catch (e) {
      console.warn('D1 update status error:', e);
    }
  }

  return c.json({ id, status, success: true });
});

// 7. Servir Fotos desde R2
app.get('/photos/:key', async (c) => {
  const key = c.req.param('key');
  if (c.env.PHOTOS_BUCKET) {
    const object = await c.env.PHOTOS_BUCKET.get(key);
    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      return new Response(object.body, { headers });
    }
  }
  return c.text('Foto no encontrada o ya purgada', 404);
});

// 8. Auto-Limpieza / Purga Manual y Cron
app.post('/admin/cleanup', async (c) => {
  let deletedPhotos = 0;
  let deletedOldAppointments = 0;

  if (c.env.DB) {
    try {
      // Purgar fotos de citas completadas o pasadas
      const todayStr = new Date().toISOString().split('T')[0];
      const { results } = await c.env.DB.prepare(`
        SELECT id, photo_keys_json FROM appointments 
        WHERE (status = 'completed' OR appointment_date < ?) AND photos_deleted = 0
      `).bind(todayStr).all();

      if (results && results.length > 0) {
        for (const row of results as any[]) {
          if (row.photo_keys_json && c.env.PHOTOS_BUCKET) {
            const keys: string[] = JSON.parse(row.photo_keys_json);
            for (const k of keys) {
              const cleanKey = k.replace('/api/photos/', '');
              await c.env.PHOTOS_BUCKET.delete(cleanKey).catch(() => {});
              deletedPhotos++;
            }
          }
          await c.env.DB.prepare(
            "UPDATE appointments SET photos_deleted = 1, photo_keys_json = '[]' WHERE id = ?"
          ).bind(row.id).run();
        }
      }

      // Eliminar registros de más de 30 días
      const deleteResult = await c.env.DB.prepare(
        "DELETE FROM appointments WHERE date(appointment_date) < date('now', '-30 days')"
      ).run();
      deletedOldAppointments = deleteResult?.meta?.changes || 0;
    } catch (e) {
      console.warn('D1 cleanup error:', e);
    }
  }

  return c.json({ deletedPhotos, deletedOldAppointments });
});

// 9. Suscripciones Web Push
app.post('/push/subscribe', async (c) => {
  const body = await c.req.json();
  if (c.env.DB && body.endpoint) {
    try {
      await c.env.DB.prepare(`
        INSERT INTO push_subscriptions (endpoint, keys_json)
        VALUES (?, ?)
        ON CONFLICT(endpoint) DO UPDATE SET keys_json = excluded.keys_json
      `).bind(body.endpoint, JSON.stringify(body.keys || {})).run();
    } catch (e) {
      console.warn('D1 push subscribe error:', e);
    }
  }
  return c.json({ success: true });
});

export const onRequest = handle(app);
