import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Bindings = {
  DB?: D1Database;
  PHOTOS_BUCKET?: R2Bucket;
  ADMIN_PIN?: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${mStr} ${ampm}`;
}

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
        INSERT INTO work_days (date, is_available, start_time, end_time, slot_duration_minutes, max_appointments, blocked_slots_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
          is_available = excluded.is_available,
          start_time = excluded.start_time,
          end_time = excluded.end_time,
          slot_duration_minutes = excluded.slot_duration_minutes,
          max_appointments = excluded.max_appointments,
          blocked_slots_json = excluded.blocked_slots_json
      `).bind(
        body.date,
        body.is_available ? 1 : 0,
        body.start_time || '08:00',
        body.end_time || '17:00',
        body.slot_duration_minutes || null,
        body.max_appointments || null,
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
  const bookedStartTimes: string[] = [];

  if (c.env.DB) {
    try {
      const settings = await c.env.DB.prepare('SELECT * FROM settings WHERE id = 1').first<any>();
      if (settings) {
        durationMinutes = settings.slot_duration_minutes;
        maxAppointments = settings.max_daily_appointments;
        startTime = settings.default_start_time;
        endTime = settings.default_end_time;
      }

      const workDay = await c.env.DB.prepare('SELECT * FROM work_days WHERE date = ?').bind(date).first<any>();
      if (workDay) {
        isAvailable = workDay.is_available === 1;
        if (workDay.start_time) startTime = workDay.start_time;
        if (workDay.end_time) endTime = workDay.end_time;
        if (workDay.slot_duration_minutes) durationMinutes = workDay.slot_duration_minutes;
        if (workDay.max_appointments) maxAppointments = workDay.max_appointments;
        if (workDay.blocked_slots_json) blockedSlots = JSON.parse(workDay.blocked_slots_json);
      }

      const { results } = await c.env.DB.prepare(
        "SELECT start_time FROM appointments WHERE appointment_date = ? AND status != 'cancelled'"
      ).bind(date).all();

      results?.forEach((r: any) => bookedStartTimes.push(r.start_time));
    } catch (e) {
      console.warn('D1 availability check error:', e);
    }
  }

  if (!isAvailable) {
    return c.json({
      date,
      is_available: false,
      start_time: startTime,
      end_time: endTime,
      slots: [],
      total_booked: bookedStartTimes.length,
      max_allowed: 0,
      remaining_slots: 0
    });
  }

  const isDayFull = bookedStartTimes.length >= maxAppointments;
  const slots: Array<{ start_time: string; end_time: string; label: string; available: boolean; reason?: string }> = [];

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

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

    const isBooked = bookedStartTimes.includes(startSlot);
    const isManuallyBlocked = blockedSlots.includes(startSlot);

    slots.push({
      start_time: startSlot,
      end_time: endSlot,
      label: `${formatTime12h(startSlot)} - ${formatTime12h(endSlot)}`,
      available: !isDayFull && !isBooked && !isManuallyBlocked,
      reason: isDayFull ? 'Cupo diario completo' : (isBooked ? 'Ocupado' : (isManuallyBlocked ? 'Bloqueado por admin' : undefined))
    });

    currentMin += durationMinutes;
  }

  const remaining = Math.max(0, maxAppointments - bookedStartTimes.length);

  return c.json({
    date,
    is_available: true,
    start_time: startTime,
    end_time: endTime,
    slots,
    total_booked: bookedStartTimes.length,
    max_allowed: maxAppointments,
    remaining_slots: remaining
  });
});

// 5. Citas (Appointments) con Purga Automática de Fotos 24h después de la Cita
app.get('/appointments', async (c) => {
  if (c.env.DB) {
    try {
      const { results } = await c.env.DB.prepare(
        'SELECT * FROM appointments ORDER BY appointment_date ASC, start_time ASC'
      ).all();

      const nowMillis = Date.now();
      const rows = results || [];

      // Detección y purga automática de fotos 24 horas después de la hora programada de la cita
      // El registro de la cita se mantiene de forma permanente para el control de métricas semanales/mensuales
      for (const r of rows as any[]) {
        if (r.photos_deleted === 0 && r.photo_keys_json && r.photo_keys_json !== '[]') {
          const appointmentUtcMillis = Date.parse(`${r.appointment_date}T${r.end_time || r.start_time || '17:00'}:00-06:00`);
          if (!isNaN(appointmentUtcMillis) && nowMillis >= appointmentUtcMillis + 24 * 60 * 60 * 1000) {
            if (c.env.PHOTOS_BUCKET) {
              try {
                const keys: string[] = JSON.parse(r.photo_keys_json);
                for (const k of keys) {
                  const cleanKey = k.replace('/api/photos/', '');
                  await c.env.PHOTOS_BUCKET.delete(cleanKey).catch(() => {});
                }
              } catch (err) {
                console.warn('Error deleting photo keys from R2:', err);
              }
            }

            await c.env.DB.prepare(
              "UPDATE appointments SET photos_deleted = 1, photo_keys_json = '[]', status = CASE WHEN status = 'pending' THEN 'completed' ELSE status END WHERE id = ?"
            ).bind(r.id).run().catch(() => {});

            r.photos_deleted = 1;
            r.photo_keys_json = '[]';
            if (r.status === 'pending') r.status = 'completed';
          }
        }
      }

      const list = rows.map((r: any) => ({
        ...r,
        amount_collected: Number(r.amount_collected || 0),
        payment_method: r.payment_method || 'sinpe',
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
    body.photos.forEach((p: any) => photoKeys.push(p.dataUrl));
  }

  if (c.env.DB) {
    try {
      await c.env.DB.prepare(`
        INSERT INTO appointments (
          id, client_name, client_phone, client_address, latitude, longitude, service_type, problem_description,
          appointment_date, start_time, end_time, photo_keys_json, photos_deleted, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending')
      `).bind(
        id,
        body.client_name,
        body.client_phone,
        body.client_address,
        body.latitude || null,
        body.longitude || null,
        body.service_type,
        body.problem_description,
        body.appointment_date,
        body.start_time,
        body.end_time,
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
    latitude: body.latitude || null,
    longitude: body.longitude || null,
    service_type: body.service_type,
    problem_description: body.problem_description,
    appointment_date: body.appointment_date,
    start_time: body.start_time,
    end_time: body.end_time,
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

// 6.1 Actualización General de Cita (ej. Cambiar o Agregar Servicios)
app.patch('/appointments/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const serviceType = body.service_type;

  if (c.env.DB) {
    try {
      if (serviceType) {
        await c.env.DB.prepare('UPDATE appointments SET service_type = ? WHERE id = ?')
          .bind(serviceType, id).run();
      }
      if (body.status) {
        await c.env.DB.prepare('UPDATE appointments SET status = ? WHERE id = ?')
          .bind(body.status, id).run();
      }
      if (body.amount_collected !== undefined) {
        await c.env.DB.prepare('UPDATE appointments SET amount_collected = ? WHERE id = ?')
          .bind(Number(body.amount_collected || 0), id).run();
      }
      if (body.payment_method) {
        await c.env.DB.prepare('UPDATE appointments SET payment_method = ? WHERE id = ?')
          .bind(body.payment_method, id).run();
      }

      const updated = await c.env.DB.prepare('SELECT * FROM appointments WHERE id = ?').bind(id).first<any>();
      if (updated) {
        return c.json({
          ...updated,
          photo_keys: updated.photo_keys_json ? JSON.parse(updated.photo_keys_json) : []
        });
      }
    } catch (e) {
      console.warn('D1 update appointment error:', e);
    }
  }

  return c.json({ id, ...body, success: true });
});

// 6.2 Catálogo Dinámico de Servicios
app.get('/services', async (c) => {
  const defaults = [
    { id: 'srv_1', title: 'Detección Especializada de Fugas', badge: 'Alta Precisión', description: 'Localización acústica y térmica de fugas ocultas' },
    { id: 'srv_2', title: 'Rastreo y Diagnóstico de Tuberías', badge: 'Sin Romper', description: 'Mapeo electromagnético y gas trazador' },
    { id: 'srv_3', title: 'Limpieza Técnica de Tuberías', badge: 'Desincrustación', description: 'Eliminación profunda de sarro y sedimentos' }
  ];

  if (c.env.DB) {
    try {
      const { results } = await c.env.DB.prepare('SELECT * FROM services ORDER BY created_at ASC').all();
      if (results && results.length > 0) {
        return c.json(results);
      }
    } catch (e) {
      console.warn('D1 get services error:', e);
    }
  }

  return c.json(defaults);
});

app.post('/services', async (c) => {
  const body = await c.req.json();
  const id = 'srv_' + crypto.randomUUID().substring(0, 8);
  const title = (body.title || '').trim();
  const badge = (body.badge || '').trim() || 'Servicio Extra';
  const description = (body.description || '').trim();

  if (!title) {
    return c.json({ error: 'El título del servicio es requerido' }, 400);
  }

  const newService = { id, title, badge, description, created_at: new Date().toISOString() };

  if (c.env.DB) {
    try {
      await c.env.DB.prepare(
        'INSERT INTO services (id, title, badge, description) VALUES (?, ?, ?, ?)'
      ).bind(id, title, badge, description).run();
    } catch (e) {
      console.warn('D1 insert service error:', e);
    }
  }

  return c.json(newService, 201);
});

app.delete('/services/:id', async (c) => {
  const id = c.req.param('id');
  if (c.env.DB) {
    try {
      await c.env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
    } catch (e) {
      console.warn('D1 delete service error:', e);
    }
  }
  return c.json({ success: true, id });
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

// 8. Auto-Limpieza / Purga de Fotos 24h (Conserva registros para KPIs)
app.post('/admin/cleanup', async (c) => {
  let deletedPhotos = 0;

  if (c.env.DB) {
    try {
      const { results } = await c.env.DB.prepare(`
        SELECT id, photo_keys_json, appointment_date, end_time, start_time, status 
        FROM appointments 
        WHERE photos_deleted = 0
      `).all();

      const nowMillis = Date.now();

      if (results && results.length > 0) {
        for (const row of results as any[]) {
          const appointmentUtcMillis = Date.parse(`${row.appointment_date}T${row.end_time || row.start_time || '17:00'}:00-06:00`);
          const isOlderThan24h = !isNaN(appointmentUtcMillis) && nowMillis >= appointmentUtcMillis + 24 * 60 * 60 * 1000;

          if (isOlderThan24h || row.status === 'completed') {
            if (row.photo_keys_json && c.env.PHOTOS_BUCKET) {
              try {
                const keys: string[] = JSON.parse(row.photo_keys_json);
                for (const k of keys) {
                  const cleanKey = k.replace('/api/photos/', '');
                  await c.env.PHOTOS_BUCKET.delete(cleanKey).catch(() => {});
                  deletedPhotos++;
                }
              } catch (e) {
                console.warn('Cleanup photo delete error:', e);
              }
            }
            await c.env.DB.prepare(
              "UPDATE appointments SET photos_deleted = 1, photo_keys_json = '[]', status = CASE WHEN status = 'pending' THEN 'completed' ELSE status END WHERE id = ?"
            ).bind(row.id).run().catch(() => {});
          }
        }
      }

      // No se eliminan los registros de citas de D1 para que el administrador
      // conserve siempre el control histórico de citas por semana y por mes.
    } catch (e) {
      console.warn('D1 cleanup error:', e);
    }
  }

  return c.json({ deletedPhotos, deletedOldAppointments: 0 });
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

// 10. Testimonios y Calificaciones de Clientes (Reviews)
app.get('/reviews', async (c) => {
  if (c.env.DB) {
    try {
      const { results } = await c.env.DB.prepare(
        'SELECT * FROM reviews WHERE is_published = 1 ORDER BY created_at DESC'
      ).all();
      return c.json(results || []);
    } catch (e) {
      console.warn('D1 get reviews error:', e);
    }
  }
  return c.json([]);
});

app.post('/reviews', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const clientName = (body.client_name || '').trim();
  const comment = (body.comment || '').trim();
  const rawRating = Number(body.rating || 5);
  const rating = Math.min(5, Math.max(1, isNaN(rawRating) ? 5 : Math.round(rawRating)));
  const serviceType = (body.service_type || 'Detección Especializada de Fugas').trim();
  const appointmentId = body.appointment_id || null;
  const clientPhone = body.client_phone || null;

  if (!clientName || !comment) {
    return c.json({ error: 'El nombre y el comentario son requeridos' }, 400);
  }

  const id = 'rev_' + crypto.randomUUID().substring(0, 10);
  const createdAt = new Date().toISOString();

  const newReview = {
    id,
    appointment_id: appointmentId,
    client_name: clientName,
    client_phone: clientPhone,
    rating,
    comment,
    service_type: serviceType,
    created_at: createdAt,
    is_verified: 1,
    is_published: 1
  };

  if (c.env.DB) {
    try {
      await c.env.DB.prepare(`
        INSERT INTO reviews (id, appointment_id, client_name, client_phone, rating, comment, service_type, created_at, is_verified, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
      `).bind(id, appointmentId, clientName, clientPhone, rating, comment, serviceType, createdAt).run();
    } catch (e) {
      console.warn('D1 insert review error:', e);
    }
  }

  return c.json(newReview, 201);
});

app.delete('/reviews/:id', async (c) => {
  const id = c.req.param('id');
  if (c.env.DB) {
    try {
      await c.env.DB.prepare('DELETE FROM reviews WHERE id = ?').bind(id).run();
    } catch (e) {
      console.warn('D1 delete review error:', e);
    }
  }
  return c.json({ success: true, id });
});

export const onRequest = handle(app);
