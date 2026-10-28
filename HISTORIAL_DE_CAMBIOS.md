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
