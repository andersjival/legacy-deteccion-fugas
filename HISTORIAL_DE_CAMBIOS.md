# 📜 HISTORIAL DE CAMBIOS APROBADOS — Legacy Detección de Fugas

Este archivo es el Registro Universal de Memoria Protegida.
Cualquier funcionalidad registrada aquí está blindada: ninguna IA puede eliminarla o revertirla.

---

## 🔗 VINCULACIÓN DEL PROYECTO

- **Repositorio:** https://github.com/andersjival/legacy-deteccion-fugas
- **Rama:** main
- **URL Producción:** https://legacydetec.pages.dev

---

## 🚀 Entregas y Versiones

### [v1.4.0] - 2026-10-28 - Panel de Administrador Adaptado 100% a Celular (Modo App Nativa)
- **Barra de Navegación Inferior Móvil (`AdminBottomNav`):**
  - Barra fija inferior con 4 pestañas accesibles con el pulgar: *Ruta Hoy* (con contador de citas activas), *Citas* (historial completo y filtros), *Horarios* (planificador y bloqueos) y *Ajustes* (notificaciones, PWA y mantenimiento).
- **Despacho Rápido "Ruta Hoy" (`TodayRouteCard`):**
  - Vista cronológica prioritaria pensada para técnicos en la calle y conduciendo.
  - Botón táctil gigante en azul Waze (`#33CCFF`) **"🚗 Iniciar Ruta en Waze"** con enlace directo a navegación por coordenadas GPS o dirección.
  - Botones táctiles rápidos: **"📞 Llamar"**, **"💬 WhatsApp"** (confirmación instantánea con mensaje pre-redactado), y **"Finalizar Trabajo"**.
  - Acordeón colapsable con fotos de evidencia y descripción del problema.
- **Pestaña de Ajustes Integrada (`AdminSettingsTab`):**
  - Instalación de PWA en pantalla de inicio de Android/iOS.
  - Suscripción y prueba de Notificaciones Push Web (VAPID).
  - Prueba de timbre sonoro y gatillo de limpieza de datos/fotos en D1 y R2.
- **Shell Móvil de Pantalla Completa (`AdminView`):**
  - Contenedor táctil `fixed inset-0` anti-scroll fantasma y anti-selección accidental.
  - Indicador de sincronización en vivo con backend Edge (Cloudflare D1).

### [v1.3.0] - 2026-10-28 - Página Aislada de Agenda Sin Distracciones (Commit: `32b7c7a`)
- **Ruta Dedicada `/agenda`:**
  - Al pulsar *"Verificar Disponibilidad y Agendar"*, *"Agendar Cita"* o seleccionar servicio, el usuario navega a `/agenda`.
  - Entorno 100% enfocado en conversión (sin barra de navegación con enlaces externos, sin testimonios ni secciones intermedias).
  - Únicas acciones permitidas: completar el agendamiento o pulsar *"Volver al inicio"* (`/`).
  - Archivo `public/_redirects` para soporte nativo de SPA en Cloudflare Pages (`/* /index.html 200`).

### [v1.2.0] - 2026-10-28 - Selector de Dirección con Mapa Interactivo y Waze (Commit: `de32265`)
- **Paso de Datos del Cliente (`StepClientDetails`):**
  - Entrada de texto para dirección exacta manual.
  - Mapa interactivo integrado (Leaflet + OpenStreetMap) con fijación de punto mediante clic o arrastre de pin.
  - Botón *"Detectar con GPS"* para cargar la ubicación exacta automáticamente con la API de Geolocalización.
- **Panel de Administrador (`AppointmentCard`):**
  - Muestra la dirección escrita y las coordenadas GPS exactas fijadas por el cliente.
  - Botón directo **"Cómo llegar en Waze"** (`waze.com/ul?ll={lat},{lng}&navigate=yes`).
  - Botón auxiliar **"Google Maps"**.
- **Backend Edge & Cloudflare D1:**
  - Migración en D1 agregando columnas `latitude REAL` y `longitude REAL` a la tabla `appointments`.

### [v1.1.0] - 2026-10-28 - Motor de Verificación Dinámica de Horarios y Bloques (Commit: `f3fbc97`)
- **Motor de Agendamiento (`#agendar`):**
  - Calendario mensual en vivo con indicador de disponibilidad por día.
  - Cabecera informativa con horario de atención (inicio a fin) y contador de espacios disponibles en tiempo real.
  - Tarjetas de turnos con rangos completos (`08:00 AM - 10:00 AM`, etc.) y etiquetas *"Disponible"* / *"Ocupado"* / *"Cupo diario completo"*.
- **Panel de Administrador PWA:**
  - Planificador "Mañana voy a trabajar" con bloqueo manual de horas específicas mediante un clic.
  - Botón verde WhatsApp (`#25D366`) **"Confirmar Cita al Cliente por WhatsApp"** con rango de horario `*{rango_hora}*`.
  - Botón de mantenimiento **"Limpiar Fotos y Datos Antiguos Ahora"**.
- **Backend Edge & Cloudflare D1:**
  - Esquema D1 actualizado con columnas `start_time` y `end_time` en `appointments` y `work_days`.
  - Endpoint `/api/availability` con cálculo dinámico de rangos y conteo de cupos restantes.

### [v1.0.1] - 2026-10-28 - Botón de Confirmación Rápida por WhatsApp (Commit: `e275e8f`)
- **Panel de Administrador:**
  - Botón destacado verde WhatsApp (`#25D366`) **"Confirmar Cita al Cliente"** en cada tarjeta de cita.
  - Ejecución simultánea: actualiza automáticamente el estado a `confirmed` en Cloudflare D1 y en la interfaz reactiva al instante.
  - Apertura automática de WhatsApp (`wa.me/506{telefono}`) con mensaje dinámico personalizado codificado:
    `"Hola *{nombre_cliente}*, le saludamos de *Legacy Detección de Fugas* 💧. Hemos revisado los detalles de su solicitud y le confirmamos su cita para el servicio de *{tipo_servicio}* el día *{fecha}* a las *{hora}*. Por favor envíenos la ubicación exacta por este medio para nuestro registro de ruta. ¡Muchas gracias!"`

### [v1.0.0] - 2026-10-28 - Inicialización y Despliegue en Producción (Commit: `6a7f3b5`)
- **Landing Page de Alta Conversión:**
  - Navbar con glassmorphism, logo sonar/gota, scroll suave y enlace directo WhatsApp / Llamada `6408-0124`.
  - Hero section con degradado celeste suave, divisores de onda SVG orgánicos, badge de precisión y doble CTA.
  - 3 Tarjetas de Servicios: Detección Especializada, Rastreo y Diagnóstico, Limpieza Técnica.
  - Bloque técnico asimétrico de equipamiento acústico y termográfico de alta precisión.
  - Sección de testimonios reales y footer corporativo con botón de instalación PWA.
- **Motor de Agendamiento Inteligente (`#agendar`):**
  - Calendario dinámico conectado a D1 (`/api/availability`).
  - Cálculo dinámico de bloques de horario según intervalo (1.5h, 2h, 3h) y cupo diario.
  - Carga y compresión en cliente (Canvas API) a formato WebP (máximo 3 fotos).
  - Confirmación instantánea y comprobante con enlace directo a WhatsApp `64080124`.
- **Panel de Administrador PWA Móvil:**
  - Acceso seguro mediante PIN (`1234`).
  - KPIs en vivo: Citas de Hoy, Semana y Mes.
  - Pestañas rápidas: Hoy, Mañana, Calendario Completo.
  - Gestor de disponibilidad: Switch "Día Laborable", horarios, intervalos de trabajo y cupo máximo.
  - Visor de evidencias con lightbox de fotos y botones de llamada/WhatsApp en 1 clic.
  - Notificaciones en tiempo real (Polling inteligente anti-drain cada 15s con alerta sonora y Web Push).
  - Gestor de auto-limpieza R2 y purga D1 (>30 días) con botón manual.
- **Backend Edge (Cloudflare Pages Functions):**
  - Hono.js en `/api/*` con endpoints de citas, disponibilidad, configuración, upload R2, webhook push y cleanup.
  - Esquema D1 `schema.sql` con 4 tablas.
  - Adaptador inteligente de Fallback Local (Demo) para previsualización inmediata sin bindings activos.
