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

### [v2.5.0] - 2026-10-28 - Auto-Purga de Fotos a las 24h con Preservación Permanente de Registros y KPIs Semanales/Mensuales
- **Auto-Purga Automática de Fotos 24h tras la Cita (`functions/api/[[route]].ts`):**
  - Implementado algoritmo de verificación temporal que purga automáticamente de Cloudflare R2 los archivos y fotos pesadas 24 horas después de transcurrida la hora programada de la cita.
- **Preservación Histórica de Registros en D1:**
  - El registro de la cita (nombre, teléfono, fecha, horario, tipo de servicio) permanece guardado permanentemente en la base de datos D1. Se eliminó la cláusula destructiva `DELETE FROM appointments` para que nunca se pierda el historial contable.
- **Control Visual de Métricas para el Administrador (`KPICards.tsx`, `AdminView.tsx`):**
  - Integradas tarjetas de control en la pestaña de citas del panel móvil que calculan en tiempo real:
    - Citas de Hoy (con desglose de pendientes).
    - Citas de Esta Semana (total de citas de lunes a domingo de la semana en curso).
    - Citas de Este Mes (acumulado histórico del mes).
- **Indicador Visual de Fotos Depuradas (`AppointmentCard.tsx`):**
  - Muestra una nota informativa confirmando que las fotos fueron liberadas de R2 mientras el registro de control sigue activo.

### [v2.4.0] - 2026-10-28 - Erradicación de Iconos de Guía / IA en Toda la Web
- **Sustitución Integral de Iconos de Guía / IA:**
  - En la sección principal de servicios (`ServicesSection.tsx`): reemplazado el icono `Compass` (brújula/guía) por `Radar` en el servicio de Rastreo y Diagnóstico, y reemplazado el icono `Sparkles` (icono genérico de IA/chispitas) por `Droplets` en el servicio de Limpieza Técnica.
  - En el Hero (`HeroSection.tsx`): reemplazado el icono de mira/guía `Crosshair` por `ShieldCheck`.
  - En el formulario de agendamiento (`StepDateAndTime.tsx`, `StepPhotoUpload.tsx`): eliminados los iconos `Sparkles`, sustituidos por `Clock` y `Camera`.
  - En los módulos administrativos (`ServiceEditorModal.tsx`, `ServicesCatalogManager.tsx`, `StorageManager.tsx`): purgados todos los iconos `Sparkles` restantes.

### [v2.3.0] - 2026-10-28 - Botón "Adelantar Cita" con Mensaje Pregrabado por WhatsApp
- **Botón "Adelantar Cita por WhatsApp" (`AppointmentCard.tsx`, `TodayRouteCard.tsx`):**
  - Implementado botón rápido en tono ámbar tanto en la tarjeta de Plan de Ruta del día como en el listado general de citas.
  - Al presionarlo en caso de terminar antes un servicio previo, abre automáticamente el chat de WhatsApp con el número del cliente y redacta un mensaje estructurado y formal preguntando si puede ser atendido más temprano hoy mismo con disponibilidad inmediata.

### [v2.2.0] - 2026-10-28 - Edición y Adición de Múltiples Servicios por Cita y Catálogo Dinámico en D1
- **Edición y Combinación de Servicios por Cita (`AppointmentCard.tsx`, `TodayRouteCard.tsx`, `ServiceEditorModal.tsx`):**
  - Añadido botón rápido `[✏️ Editar / +Servicios]` en cada tarjeta de cita tanto en vista general como en modo ruta callejera.
  - Modal interactivo con selección múltiple tipo chip para combinar múltiples servicios (`Servicio A + Servicio B`) o redactar servicios personalizados al vuelo.
  - Sincronización instantánea con el mensaje automático de confirmación por WhatsApp y el registro de ruta.
- **Catálogo Dinámico de Servicios en Cloudflare D1 (`functions/api/[[route]].ts`, `ServicesCatalogManager.tsx`, `AdminSettingsTab.tsx`):**
  - Creada tabla `services` en Cloudflare D1 y endpoints REST (`GET`, `POST`, `DELETE /api/services`).
  - Panel de administración con gestor de catálogo en la pestaña Ajustes para dar de alta nuevos servicios o eliminar obsoletos.
- **Sincronización con el Formulario de Agendamiento del Cliente (`StepClientDetails.tsx`):**
  - El selector desplegable de servicios en el Paso 2 carga automáticamente el catálogo actualizado desde la API, reflejando cualquier nuevo servicio agregado por el administrador.

### [v2.1.0] - 2026-10-28 - Fotos 100% Opcionales y Visibilidad Móvil de Síntomas (Commit: `034ac60`)
- **Subida de Fotos 100% Opcional (`StepClientDetails.tsx`, `StepPhotoUpload.tsx`):**
  - Añadido botón de confirmación directa en el Paso 2: *"Confirmar Cita (Sin Fotos)"* para que el usuario pueda agendar en 1 clic sin pasar por el paso de imágenes.
  - El botón secundario *"Subir Fotos (Opcional)"* queda disponible para quienes sí deseen adjuntar evidencia.
  - En el Paso 3, el botón adapta su texto a *"Confirmar Cita (Sin Fotos)"* si no se añaden imágenes, o *"Confirmar Cita con X Foto(s)"*.
- **Reubicación de la Descripción de Síntomas (`StepClientDetails.tsx`):**
  - Se movió el campo *"Descripción del Problema o Síntomas"* a la posición inmediata superior (justo después del Tipo de Servicio y antes de la dirección/mapa). Ahora es 100% visible desde cualquier celular sin necesidad de desplazarse por debajo del mapa.

### [v2.0.0] - 2026-10-28 - UX Móvil Compacta en Agenda: Auto-Scroll, Checks Verdes y Rediseño de Pasos (Commit: `db29d1b`)
- **Botón de Paso 1 Mejorado (`StepDateAndTime.tsx`):**
  - Texto actualizado a *"Siguiente: Indicar Ubicación y Contacto →"*, comunicando claramente la acción siguiente.
- **Auto-Scroll al Inicio de Cada Paso (`BookingWizard.tsx`):**
  - Al pulsar continuar, la pantalla se desplaza de forma fluida y automática a la parte superior del formulario, permitiendo ver el primer campo a llenar de inmediato.
- **Feedback Visual con Checks Verdes en Tiempo Real (`StepClientDetails.tsx`):**
  - A medida que el cliente completa cada dato (Nombre, Teléfono WhatsApp, Dirección, GPS fijado en el mapa, Síntomas), el campo se ilumina en verde esmeralda con una insignia y un icono de check (`✓ Listo`).
- **Compactación Vertical y Rediseño Angosto (`BookingWizard.tsx`, `AgendaPage.tsx`):**
  - Erradicado el exceso de espacio en móvil: cabecera reducida, márgenes ajustados y barra de progreso de pasos (`1 2 3`) más angosta y conectada con líneas sutiles para evitar scroll innecesario.

### [v1.9.0] - 2026-10-28 - Transparencia Glassmorphism en Tarjeta Flotante del Hero (Commit: `d7780ce`)
- **Efecto Traslúcido de Alto Contraste (`HeroSection.tsx`):**
  - Transformada la tarjeta flotante *"Rastreo Acústico Activo / Geófono Digital y Gas Trazador"* de opaca (`bg-brand-dark/95`) a cristal translúcido (`bg-brand-dark/35 backdrop-blur-sm border-white/25`).
  - Permite visualizar con total claridad las letras, datos y detalles del pie de la fotografía real situada detrás, conservando legibilidad mediante tipografía brillante (`text-cyan-300`, `drop-shadow-md`).

### [v1.8.0] - 2026-10-28 - Desbloqueo de Caché PWA y Encabezados Anti-Freeze (Commit: `54dcdea`)
- **Actualización de Service Worker (`sw.js` a `legacy-pwa-v2`):**
  - Implementada estrategia *Network-First* obligatoria para navegación HTML. Si hay internet, siempre pide la versión fresca de la nube en lugar de servir el archivo local congelado.
  - Purga automática de cachés anteriores (`legacy-pwa-v1`) con `caches.delete()` en el evento `activate`.
- **Encabezados HTTP en Cloudflare Pages (`public/_headers`):**
  - Encabezados estrictos `Cache-Control: no-cache, no-store, must-revalidate` para `sw.js` y `manifest.webmanifest`, asegurando que los navegadores detecten actualizaciones al instante sin retención fantasma de 24 horas.
- **Auto-Recarga Reactiva (`usePWA.ts`):**
  - Evento `controllerchange` configurado para actualizar silenciosamente cualquier pestaña abierta en cuanto el nuevo Service Worker se activa.

### [v1.7.0] - 2026-10-28 - Aislamiento Radical de la Agenda en Página Independiente `/agenda` (Commit: `f70509b`)
- **Extracción Total del Inicio (`App.tsx`):**
  - Eliminado por completo el componente de agendamiento (`BookingWizard`) de la página principal (`/`). La página de inicio ya no contiene el formulario, erradicando cualquier salto o scroll hacia abajo.
- **Navegación Exclusiva a `/agenda`:**
  - Botón de Hero *"Verificar Disponibilidad y Agendar"*, botones de Navbar, tarjetas de Servicios, banner de evidencia y pie de página reconectados con enlace directo `href="/agenda"`.
  - Detección y redirección automática de anclas residuales (`#agendar` / `#agenda`) hacia la ruta limpia `/agenda`.
- **Entorno Limpio y Sin Distracciones (`AgendaPage.tsx`, `BookingWizard.tsx`):**
  - Vista exclusiva donde el usuario solo puede completar su cita técnica o pulsar *"Volver al inicio"*, sin elementos ajenos ni distracciones.

### [v1.6.0] - 2026-10-28 - Reemplazo de Imágenes Genéricas por Fotografías Reales de Legacy (Commit: `cf7db08`)
- **Hero Section (`HeroSection.tsx`):**
  - Eliminación de imagen de stock Unsplash y reemplazo por fotografía real en acción (`/images/hero-deteccion-fugas.png`): técnico con auriculares localizando fuga activa en tubería con sensor acústico.
- **Sección de Tecnología y Equipos (`TechShowcase.tsx`):**
  - Eliminación de imagen genérica y sustitución por foto real de maletín técnico especializado (`/images/tecnologia-equipo.png`).
- **Banner de Evidencia y Punto Exacto (`ServicesSection.tsx`):**
  - Incorporación de fotografía real "Antes y Después" (`/images/caso-punto-exacto.png`) demostrando la excavación y reparación puntual de tubería sin rupturas innecesarias.

### [v1.5.0] - 2026-10-28 - Integración del Logo Oficial de Águila de Legacy (Commit: `a6aed4a`)
- **Navbar Principal (`Navbar.tsx`):**
  - Reemplazo del isotipo temporal por el logo oficial del águila azul (`/logo.png`) en contenedor estilizado con micro-hover.
- **Página de Agenda Aislada (`AgendaPage.tsx`):**
  - Inclusión del logo oficial en la cabecera limpia de `/agenda`.
- **Pie de Página (`Footer.tsx`):**
  - Actualización del identificador visual de marca en la sección inferior.
- **Panel Administrativo Móvil (`AdminView.tsx`):**
  - Logo oficial incorporado en la cabecera del panel de control de despacho en campo.
- **Iconografía PWA y Favicon (`index.html`, `manifest.webmanifest`):**
  - Vinculación de `/logo.png` en `apple-touch-icon`, `favicon` y manifiesto para acceso directo en pantalla de inicio.

### [v1.4.0] - 2026-10-28 - Panel de Administrador Adaptado 100% a Celular (Modo App Nativa) (Commit: `2426eae`)
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
