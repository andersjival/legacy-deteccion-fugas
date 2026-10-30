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

### [v2.59.0] - 2026-10-30 - Erradicación de Sobreescritura de Cotizaciones al Enviar Múltiples
- **Generación Única Obligatoria por Cotización (`JobQuoteManager.tsx`):**
  - Identificada la causa raíz: al presionar "Guardar y enviar", el sistema reutilizaba el mismo ID de la cotización anterior, provocando que la base de datos D1 actualizara el mismo registro (`ON CONFLICT(id) DO UPDATE`) en lugar de insertar uno nuevo, manteniendo el contador estático.
  - Implementada asignación forzada de nuevo ID (`quote_${Date.now()}_...`) y nuevo número de control (`generateQuoteNumber()`) cada vez que se envía una cotización para un cliente nuevo o modificado.
  - Al completar el envío, el editor renueva de inmediato su identificador y consecutivo, preparando los campos para la siguiente cotización sin riesgo de sobreescribir las anteriores.


### [v2.58.0] - 2026-10-30 - Feedback de "Guardado Correctamente" y Redirección en 3 Segundos al Enviar
- **Flujo de Envío con Temporizador y Notificación Inmediata (`JobQuoteManager.tsx`):**
  - Al presionar **"Guardar y enviar"**, el sistema almacena de inmediato la cotización en Cloudflare D1 y despliega en tiempo real el mensaje de confirmación: *"✅ Cotización guardada correctamente. Redirigiendo a WhatsApp en 3 segundos..."*.
  - Incorporada cuenta regresiva interactiva (3s -> 2s -> 1s) visible tanto en el banner de notificación superior como en el propio botón de acción.
  - Al completar los 3 segundos, se ejecuta la redirección automática a WhatsApp con el formato y enlace oficial `/cotizacion/:id`.


### [v2.57.0] - 2026-10-30 - Botón y Pestaña de "Cotizaciones Enviadas" en Gestor de Cotizaciones
- **Botón "Cotizaciones Enviadas" en Barra de Acciones (`JobQuoteManager.tsx`):**
  - Incorporado botón directo `Cotizaciones Enviadas` con icono `Send`, color esmeralda y contador en tiempo real (`sentQuotes.length`).
  - Al hacer clic, abre y enfoca la bandeja filtrando de inmediato únicamente las cotizaciones con estado `enviada` o `aceptada`.
- **Pestaña Filtrada en Bandeja de Historial:**
  - Añadida la pestaña `Enviadas (X)` junto a `Por Enviar (X)` y `Todas (X)` en el panel de historial, con vista vacía informativa personalizada.


### [v2.56.0] - 2026-10-30 - Eliminación del Botón "Compartir Enlace" en Barra de Cotizador
- **Depuración de Barra de Acciones (`JobQuoteManager.tsx`):**
  - Eliminado el botón redundante "Compartir Enlace" de la barra superior del gestor de cotizaciones.
  - La interfaz queda optimizada y simplificada, manteniendo las acciones principales directas: "Guardar y enviar" (WhatsApp con enlace dinámico integrado), "Solo guardar", "Descargar PDF", "Imprimir", "Copiar" y "Nueva Cotización".


### [v2.55.0] - 2026-10-29 - Botón "Crear Cotización" en Citas y Enlace Inteligente a Cotizador Personalizado
- **Aislamiento Estricto de "Compartir Cotización Oficial" (`AppointmentCard.tsx` / `TodayRouteCard.tsx`):**
  - El botón "Compartir Cotización Oficial por WhatsApp" ahora aparece **únicamente** cuando el administrador ya ha creado una cotización formal para ese cliente en el sistema.
  - Al compartirla, utiliza los datos reales de la cotización creada (N° de control oficial, desglose verídico, montos personalizados y enlace `/cotizacion/:id`), eliminando la generación ciega de cotizaciones genéricas.
- **Botón "Crear Cotización" con Prellenado Automático (`AdminView.tsx` / `JobQuoteManager.tsx`):**
  - Cuando una cita no tiene cotización creada, el botón muestra **"Crear Cotización"** con icono `FilePlus`.
  - Al hacer clic, navega de inmediato a la pestaña `Cotizador`, abriendo el formulario prellenado con los datos específicos de ese cliente: nombre, teléfono, dirección, tipo de servicio solicitado, fecha y descripción del problema.
  - Notificación visual inmediata en el cotizador indicando que el formulario está listo para personalizar montos y alcances antes de guardar o enviar.


### [v2.54.0] - 2026-10-29 - Depuración Comercial en /PROYECTO y Confirmación de Rastreo de Clics
- **Depuración de Textos Técnicos en Propuesta Comercial (`ProjectPresentationPage.tsx`):**
  - Removidos de forma quirúrgica los ítems técnicos del acta de entrega ejecutiva: *"Infraestructura Global en Cloudflare Pages con Base de Datos SQL D1 distribuida, carga en <0.5s y cero costos mensuales de hosting"* y *"Propiedad Total del Código Fuente en React, TypeScript y Tailwind CSS, sin suscripciones a WordPress ni plugins de terceros"*.
  - Ajustados los módulos de entregables y métricas de infraestructura para orientarse 100% al valor de negocio y velocidad comercial sin comprometer detalles técnicos internos ni propiedad de código.
- **Auditoría de Registro de Clics y Vistas en Cotizaciones:**
  - Confirmado el funcionamiento del rastreador en vivo: cada clic del cliente en `/cotizacion/:id` incrementa automáticamente `view_count` en Cloudflare D1 y actualiza la tarjeta en el panel con `👁️ Vista (X veces) - No descargada aún`, `✅ Descargada por el cliente` al descargar el PDF, y `✅ Aceptada por Cliente` al confirmar la propuesta.


### [v2.53.0] - 2026-10-29 - Doble Acción en Cotizador: "Guardar y enviar" y "Solo guardar"
- **Acciones Duales de Cotización en Barra Superior e Inferior (`JobQuoteManager.tsx`):**
  - Implementados los dos botones directos en la interfaz de creación y edición de cotizaciones:
    1. **"Guardar y enviar"**: Guarda la cotización de forma persistente en Cloudflare D1 y almacenamiento local con estado `enviada`, genera el enlace dinámico y abre automáticamente WhatsApp con el texto oficial, desglose técnico y enlace `/cotizacion/:id`.
    2. **"Solo guardar"**: Guarda la cotización en Cloudflare D1 con estado `por_enviar` para almacenarla en la bandeja de pendientes sin disparar WhatsApp, permitiendo su revisión o envío posterior.
  - Disponibles y visibles de forma simétrica tanto en la barra de herramientas superior como en la tarjeta de acciones al final del formulario editor para máxima comodidad en PC y móvil.
- **Feedback Visual y Contador de Pendientes:**
  - Añadida retroalimentación visual con estado de carga (`Enviando...` / `Guardando...`) y confirmación con hora exacta del usuario (`✅ ¡Guardada!`), sincronizado con el contador en tiempo real de cotizaciones pendientes por enviar.


### [v2.52.0] - 2026-10-29 - Sincronización Universal en Tiempo Real de Cotizaciones (PC & Móvil)
- **Erradicación del Desfase de Cotizaciones por Enviar (`JobQuoteManager.tsx` / `api.ts`):**
  - Identificada y eliminada la causa raíz del desfase: la retención de cotizaciones fantasmas `localOnly` en `localStorage` de la computadora que no existían en D1 y la falta de sincronización bidireccional inmediata.
  - Establecida Cloudflare D1 como única fuente de verdad universal para todas las instancias (móviles y web), sincronizando el estado exacto sin resucitar registros eliminados.
- **Sincronización Reactiva al Cambiar de Pestaña o Desbloquear Móvil (`JobQuoteManager.tsx`):**
  - Implementados oyentes de eventos `visibilitychange` y `window.focus`, junto con reducción del intervalo de polling a 8 segundos. Cuando el usuario abre o regresa a la aplicación en su celular o PC, la lista de cotizaciones se refresca al instante.
  - Añadido botón manual `Sincronizar` con animación giratoria en el panel de cotizaciones para actualización forzada en un toque.
- **Cabeceras Anti-Caché Estrictas (`[[route]].ts` / `api.ts`):**
  - Añadida cabecera `Cache-Control: no-store, no-cache, must-revalidate, max-age=0` y `Pragma: no-cache` tanto en las Functions de Cloudflare Pages (`/api/quotes`) como en las peticiones cliente (`fetch`), impidiendo que navegadores móviles cacheen listados obsoletos.
  - Eliminado el bloqueo permanente de fallback local en `api.ts`, asegurando que todas las peticiones se comuniquen directamente con la base de datos central en la nube.

### [v2.51.0] - 2026-10-29 - Pop-up de Aceptación Nativa de Cotización y Erradicación del Botón de WhatsApp
- **Flujo Nativo de Aceptación con Pop-up (`ClientQuoteView.tsx`):**
  - Reemplazado el botón de "Aceptar por WhatsApp" por un botón nativo oficial `Aceptar Cotización` con icono `CheckCircle2` en la barra superior del cliente.
  - Al hacer clic, se despliega un pop-up modal con el resumen formal de la cotización (N° de Control, Cliente, Trabajo técnico, Monto total) y el mensaje prediseñado de aceptación de términos y alcance técnico.
  - Al presionar `Enviar Aceptación`, se actualiza el estado de la cotización en el servidor y base de datos a `aceptada` (`api.updateQuoteStatus`), mostrando inmediatamente la confirmación oficial: *"La aceptación ha sido enviada al administrador y se pondrá en contacto contigo en las próximas horas."*
- **Erradicación del Botón de WhatsApp en Aceptación:**
  - Eliminado el desvío automático hacia WhatsApp al aceptar la propuesta; el cliente completa la aceptación formal directamente en la aplicación web sin intermediarios.
  - Reemplazado el enlace de WhatsApp en el pie de la cotización por enlace de llamada directa a la central telefónica (`tel:6408-0124`).
- **Insignia de Cotización Aceptada en Panel de Control (`JobQuoteManager.tsx` / `quote.ts`):**
  - Agregado el estado `'aceptada'` en los tipos y en la bandeja de cotizaciones, mostrando la pastilla verde destacada `✅ Aceptada por Cliente` para conocimiento inmediato del administrador.

### [v2.50.0] - 2026-10-29 - Corrección de Mensaje de WhatsApp al Compartir Cotización y Aislamiento de Reseña Post-Servicio
- **Mensaje Programado de Cotización Oficial por WhatsApp (`AppointmentCard.tsx` / `TodayRouteCard.tsx` / `JobQuoteManager.tsx`):**
  - Implementado botón dedicado `Compartir Cotización Oficial por WhatsApp` en tarjetas de citas (`AppointmentCard` y `TodayRouteCard`).
  - Corregido el mensaje predeterminado: ahora envía formalmente la notificación programada de cotización lista (*"Hola [Cliente], le saluda el técnico de Legacy Detección de Fugas 💧. Ya realicé su cotización oficial para el servicio de [Servicio]..."*), incluyendo desglose resumido de trabajo, dirección, fecha programada, garantía y el enlace directo oficial `/cotizacion/:id`.
  - Asegurado el registro y guardado automático de la cotización en Cloudflare D1 y almacenamiento local (`api.saveQuote`) al momento de compartirla para su visualización y descarga en PDF por parte del cliente.
- **Aislamiento Estricto de Calificaciones Post-Servicio (`AppointmentCard.tsx` / `TodayRouteCard.tsx`):**
  - Condicionado el botón y plantilla de solicitud de testimonios (*"Fue un placer haberle realizado el servicio... calificar..."*) para que se muestre **únicamente** cuando la cita ha sido marcada como finalizada (`status === 'completed'`), eliminándolo de citas pendientes o en curso.
- **Encabezado Cálido en Cotizador Web (`JobQuoteManager.tsx`):**
  - Actualizado el generador de texto de cotizaciones y copiado con título para anteponer siempre el saludo personalizado y el aviso de cotización completada antes del desglose de costos.

### [v2.49.0] - 2026-10-29 - Transformación de /PROYECTO en Landing Page de Venta de Alta Conversión e Inventario Llave en Mano
- **Landing Page de Venta Persuasiva B2B (`ProjectPresentationPage.tsx`):**
  - Transformada la vista `/PROYECTO` en una propuesta comercial y página de venta de alta persuasión dirigida a David Rojas para asegurar la adquisición formal de la plataforma.
  - Incorporada barra de navegación rápida en el encabezado (`10 Innovaciones`, `Qué Recibes`, `Comparativa`, `Cotizador`) y diseño premium luxury con gradientes y tarjetas de impacto.
- **Inventario Ejecutivo Llave en Mano Punto por Punto (`ProjectPresentationPage.tsx`):**
  - Creada sección dedicada `#resumen-entregables` con 12 módulos desglosados en 4 pilares estratégicos (Ventas & Cierre, Operación & Control, Captación & Reputación, Tecnología & Propiedad), cada uno con checklist de 3 puntos, insignias de valor y enlaces interactivos a demos en vivo.
  - Añadido bloque de acta de entrega integral con checklist ejecutivo de 12 puntos de software, infraestructura y derechos de propiedad.
- **Tabla Comparativa y Cierre Comercial con WhatsApp (`ProjectPresentationPage.tsx`):**
  - Diseñada tabla comparativa `#tabla-comparativa` (*Web Común de $100 vs Plataforma Royalty*).
  - Integrado botón de acción directo de WhatsApp preconfigurado para formalizar y poner en marcha la entrega.

### [v2.48.0] - 2026-10-29 - Validación Estricta Anti-Fraude de Teléfono en Testimonios
- **Verificación Obligatoria de Cita Previa (`[[route]].ts` / `api.ts` / `ClientReviewPage.tsx`):**
  - Implementada comprobación estricta en base de datos D1 y almacenamiento local de las citas agendadas: cualquier reseña enviada con un número de teléfono que no pertenezca a un cliente con citas registradas en Royalty es rechazada con código `403 Acceso Denegado`.
  - Normalizada la coincidencia telefónica por los últimos 8 dígitos (formato estándar de Costa Rica), blindando el portal contra personas malintencionadas o testimonios falsos.
  - Erradicado el guardado ciego en fallback local si el servidor devuelve un error de validación, mostrando mensaje explícito al usuario en pantalla.

### [v2.47.0] - 2026-10-29 - Sincronización y Purga de Caché de la PWA (v2.46)
- **Sincronización Total Web y PWA (`sw.js`):**
  - Actualizado el identificador de caché a `legacy-pwa-v2.46`, forzando la purga inmediata de versiones anteriores en cualquier teléfono o computadora instalada.
  - Blindada la estrategia `Network-First` y `no-cache` en cabeceras de Service Worker y manifiesto, garantizando que la PWA siempre se mantenga 100% idéntica y sincronizada en tiempo real con la versión web.

### [v2.46.0] - 2026-10-29 - Enfoque Persuasivo y Unificación de Solución & Beneficio en /PROYECTO
- **Erradicación de Términos de Dolor y Personalismo Excesivo (`ProjectPresentationPage.tsx`):**
  - Eliminadas las etiquetas "El Dolor del Negocio Común" y "El Impacto para David Rojas".
  - Reemplazado por un esquema de 2 columnas de alto impacto: `[Adiós al Método Tradicional]` (enfoque persuasivo y propositivo: "ya no más cuadernos viejos, reservas fáciles e inmediatas, cuando tus clientes vean tus testimonios te contratarán más") y `[Solución Implementada & Beneficio Directo]`.
- **Unificación Cohesiva de Solución y Resultados (`ProjectPresentationPage.tsx`):**
  - Fusionados la solución técnica y el beneficio económico/operativo en un solo bloque integrado ("cero dinero perdido por olvidos administrativos", duplicación de velocidad de cierre y máxima seriedad corporativa).
  - Actualizada clave de almacenamiento local a `_v3` para refresco automático sin caché residual.

### [v2.45.0] - 2026-10-29 - Rediseño Compacto y Elegante de la Pastilla de Cita Ocupada
- **Pastilla Compacta de Cita Ocupada (`AppointmentCard.tsx`):**
  - Sustituido el bloque sobrecargado con fecha y horas repetidas por una pastilla compacta, fina y discreta `[🔒 Ocupada]` (`text-[11px]`, `px-2.5 py-0.5 rounded-full`) con `whitespace-nowrap`.
  - Eliminados los saltos de línea y deformaciones visuales en tarjetas de citas, manteniendo la fecha y rango de horas organizados en su propia cuadrícula inferior limpia.

### [v2.44.0] - 2026-10-29 - Enrutamiento Insensible a Mayúsculas y Carga Universal de /PROYECTO
- **Normalización de Rutas a Minúsculas (`App.tsx`):**
  - Implementada normalización automática con `.toLowerCase()` tanto en la inicialización de `currentPath` como en los eventos de navegación (`handlePopState`, `navigateTo` y `normalizedPath`).
  - Habilitado el acceso inmediato y sin errores a rutas escritas en mayúsculas (`/PROYECTO`, `/AGENDA`, `/CITAS`, `/COTIZADOR`, `/TESTIMONIOS`) sin caer al inicio por discrepancia tipográfica.

### [v2.43.0] - 2026-10-29 - Corrección de Posición de Barra de Desplazamiento y Navegación Suave sin Saltos en Citas
- **Barra de Desplazamiento al Borde Extremo Derecho (`AdminView.tsx`):**
  - Desacoplado el desbordamiento vertical (`overflow-y-auto`) del contenedor centrado con ancho restringido (`max-w-lg md:max-w-6xl xl:max-w-7xl`).
  - Creado contenedor envolvente de pantalla completa `#admin-main-scroller` (`w-full flex-1 overflow-y-auto scroll-smooth`), posicionando la barra de scroll exactamente en el borde derecho natural de la pantalla.
- **Erradicación del Salto Brusco al Seleccionar Filtros de Fecha (`AdminView.tsx`):**
  - Eliminado el desmontaje y colapso de altura (`loadingAvailability`) en la cuadrícula de horarios mediante un contenedor persistente con `min-h-[220px]`.
  - Añadido scroll suave programático (`scrollIntoView({ behavior: 'smooth', block: 'start' })`) hacia `#horarios-disponibilidad-section` al pulsar "Hoy", "Mañana", "Pasado mañana", "Esta semana" o días individuales.
  - Implementada transición suave (`animate-in fade-in duration-300`) tanto en la cuadrícula de horarios como en el listado de citas filtradas.

### [v2.42.0] - 2026-10-29 - Integración Unificada de Día y Fecha en la Pastilla de Horario de Ruta y Máxima Claridad en Citas Ocupadas
- **Unificación de Día, Fecha y Horario en Rutas de Hoy (`TodayRouteCard.tsx`):**
  - Integrado de forma unificada en la pastilla principal del horario: `[10:00 AM - 12:00 PM • Jueves, 29 de octubre]` con iconos de reloj y calendario en un solo bloque destacado.
- **Identificación Inconfundible de Citas Ocupadas en Todas las Citas (`AppointmentCard.tsx` / `AdminView.tsx`):**
  - En cada tarjeta de cita se resalta el bloque azul con animación de pulso: `🔒 CITA OCUPADA • [Día de la semana, Fecha] • [Rango de Horas]`.
  - En la vista de cuadrícula y selector de fechas, todos los bloques ocupados indican claramente `🔒 OCUPADA` junto al día de la semana y la fecha para facilitar la orientación y ubicación inmediata del usuario.

### [v2.41.0] - 2026-10-29 - Eliminación de Etiqueta Vista PC y Ajuste de Ancho para Visibilidad Total del Menú Superior
- **Eliminación de Etiqueta Innecesaria (`AdminView.tsx`):**
  - Retirada la pastilla *"Vista PC / Escritorio"* al lado del título, liberando más de 140px de espacio horizontal en el encabezado.
- **Optimización de Dimensiones del Menú de Navegación (`AdminView.tsx`):**
  - Calibrado el espaciado y padding del encabezado (`px-3 sm:px-4 md:px-5` y `h-14`) y de las pestañas centrales (`px-2.5 lg:px-3 py-1.5` con texto `text-[11px] lg:text-xs`).
  - Garantizada la visibilidad permanente y sin cortes de los botones laterales *"Reseñas"* y *"Cerrar"* en cualquier resolución y factor de escala.

### [v2.40.0] - 2026-10-29 - Eliminación de Término D1, Día y Fecha en Rutas de Hoy y Visualización de Citas Ocupadas en Todas las Citas
- **Eliminación Total de la Palabra D1 en Interfaces de Usuario (`AdminView.tsx` / `TrafficAnalytics.tsx` / `ProjectPresentationPage.tsx`):**
  - Removida la palabra "D1" de todas las etiquetas visibles para el usuario:
    - Encabezado de panel administrativo: de `En Vivo D1` a `En Vivo`.
    - Rastreador de tráfico y métricas: de `En Vivo D1` a `En Tiempo Real`, y de `Últimos Eventos de Tráfico en Vivo (D1)` a `Últimos Eventos de Tráfico en Vivo`.
    - Página de presentación de proyecto: sustituido por terminología formal de nube de alta disponibilidad.
- **Día de la Semana y Fecha en Tarjetas de Rutas de Hoy (`TodayRouteCard.tsx`):**
  - En cada tarjeta de la ruta diaria, junto al rango de horario (ej. `10:00 a. m. - 12:00 m.`), se incorporó la pastilla con el día de la semana y fecha correspondiente (ej. `📅 Jueves, 29 de octubre`).
- **Visualización Explícita de Horarios Ocupados en Todas las Citas (`AppointmentCard.tsx` / `AdminView.tsx`):**
  - En cada tarjeta de cita se añadió el distintivo oficial `🔒 HORARIO OCUPADO: [Día de la semana, Fecha] ([Rango de Horas])`.
  - En los bloques de horario ocupados en la cuadrícula de disponibilidad se incluyó el día y fecha respectiva.
  - Al seleccionar el filtro *"Todas"*, se habilitó la cuadrícula general de citas con horarios ocupados indicando `🔒 OCUPADA` con su día, fecha y botón directo para ver la cita.

### [v2.39.0] - 2026-10-29 - Erradicación Total del Movimiento y Salto en el Menú Superior al Actualizar
- **Fijación de Geometría Estricta del Menú Superior (`AdminView.tsx`):**
  - Fijada la altura estricta del encabezado superior a `h-16 min-h-[64px]` con `shrink-0` en todos sus contenedores principales (logo, barra de navegación central y botones de acción derecha).
  - Sustituido `transition-all` por `transition-colors duration-150` en cada botón de pestaña del menú superior, impidiendo que el motor CSS anime el ancho, márgenes o posiciones durante el renderizado o refresco.
- **Sincronización Inmediata sin Parpadeo en Citas y Reseñas (`useAppointments.ts` / `useReviews.ts` / `api.ts`):**
  - Los hooks de citas y reseñas ahora inicializan su estado directamente desde el almacenamiento local sincronizado (`localStorage`).
  - Las pastillas numéricas de badges ("Ruta de Hoy", "Todas las Citas", "Reseñas") se renderizan desde el milisegundo cero sin aparecer tardíamente ni desplazar horizontalmente los botones adyacentes.
  - El servicio `api.getAppointments()` sincroniza automáticamente la caché local tras cada consulta exitosa a la red.
- **Estabilidad en Barra de Navegación Pública (`Navbar.tsx` / `TrafficAnalytics.tsx`):**
  - Reemplazado `transition-all` por `transition-colors` en el encabezado sticky público y sus botones de llamada a la acción, erradicando saltos al cargar o restaurar scroll.

### [v2.38.0] - 2026-10-29 - Enlace de Testimonio Vinculado al Celular y Detección de Enlaces Compartidos en Panel
- **Vinculación Obligatoria del Celular en Enlaces de Calificación (`AppointmentCard.tsx` / `TodayRouteCard.tsx`):**
  - Los botones de envío por WhatsApp generan el enlace oficial con el número de teléfono del cliente verificado como parámetro (`&tel=...`).
- **Blindaje y Verificación en Página de Calificación (`ClientReviewPage.tsx` / `/calificar`):**
  - Al abrir el enlace, el sistema lee el celular y bloquea la sesión mostrando la insignia `🔒 Enlace Oficial y Blindado • Celular del cliente: [tel]` con estado verificado.
  - Si se accede sin enlace de cita, se solicita de forma obligatoria el número de teléfono para verificación.
  - La opinión se envía y registra en D1 y memoria local asociada al celular del cliente.
- **Detección Automática de Enlaces Compartidos en Panel Administrativo (`AdminReviewsCard.tsx`):**
  - Muestra en cada testimonio el número telefónico del cliente junto a su nombre.
  - Detecta mediante conteo por normalización de dígitos si un mismo número de teléfono ha enviado 2 o más opiniones.
  - Si se detecta repetición, despliega la alerta destacada: `⚠️ Enlace Compartido — Celular repetido X veces ([tel]). El cliente original compartió su enlace exclusivo con un tercero para generar esta opinión adicional`, y añade un contador superior de enlaces compartidos.

### [v2.37.0] - 2026-10-29 - Selector de Horarios (Hoy, Mañana, Pasado mañana, Esta semana) con Bloques Verde (Disponible) y Azul (Ocupado) y Reserva Telefónica Inmediata
- **Selector de Rango de Fechas en Citas (`AdminView.tsx` / `dateFormatter.ts`):**
  - Implementados los botones interactivos de selección rápida: *"Hoy"*, *"Mañana"*, *"Pasado mañana"*, *"Esta semana"* y *"Todas"*.
  - En *"Esta semana"*, se despliega una barra con los 7 días consecutivos para consultar cualquier fecha a un clic.
- **Cuadrícula Visual de Horarios con Código de Color Verde y Azul:**
  - **Verde (`DISPONIBLE`):** Muestra todos los bloques de horario libres del día con botón *"Reservar Horario"*.
  - **Azul (`OCUPADA`):** Muestra los horarios con cita agendada, nombre del cliente, tipo de servicio y botón *"Ver Cita"*.
- **Reserva Telefónica Inmediata y Bloqueo en Tiempo Real:**
  - Al recibir una llamada de un cliente, el técnico visualiza los horarios en verde y pulsa *"Reservar Horario"* abriendo el modal express.
  - Al ingresar el cliente y confirmar, la cita se registra con estado confirmada, el bloque pasa automáticamente a **Azul** y queda bloqueado en la web para que ningún otro usuario pueda tomarlo.

### [v2.36.0] - 2026-10-29 - Espera Estricta de 10 Segundos antes del Auto-Scroll en Guardar Cotización
- **Calibración de Temporizador de Auto-Scroll a 10 Segundos (`JobQuoteManager.tsx`):**
  - Ajustado el tiempo de espera del cuadro inferior a 10 segundos completos (`10000ms`) antes de que el sistema suba automáticamente a la lista superior.
  - Se garantiza que el usuario pueda apreciar tranquilamente el estado verde de confirmación y la hora exacta de guardado.
  - Si el usuario desea subir antes de que transcurran los 10 segundos, puede pulsar el botón *"Ver arriba ↑"* para desplazarse inmediatamente y cancelar la espera automática.

### [v2.35.0] - 2026-10-29 - Testimonios y Reseñas en Página Independiente, Botón Compacto y Erradicación de Parpadeo y Salto en Métricas
- **Testimonios y Reseñas en Página Propia (`AdminView.tsx` / `App.tsx` / `Navbar.tsx` / `Footer.tsx`):**
  - Retirada la tarjeta de testimonios del tab de Citas en el panel administrativo y creada la pestaña dedicada `reviews` (`/detec/panel?tab=reviews` o `/resenas`).
  - Creada la página pública independiente `/testimonios` con acceso directo desde el menú de navegación y pie de página, liberando la página de inicio principal.
- **Sustitución del Botón "Refrescar" por Botón Pequeño de Reseñas (`AdminView.tsx`):**
  - Eliminado el botón innecesario *"Refrescar"* de la barra superior administrativa.
  - Incorporado en su lugar el botón compacto *"Reseñas"* con icono de estrella y contador numérico en pastilla que dirige de forma instantánea a la página de testimonios.
- **Erradicación del Parpadeo (1 → 0 → 1) y Salto en Tráfico y Métricas (`TrafficAnalytics.tsx` / `AdminView.tsx`):**
  - Implementada inicialización síncrona inmediata desde caché local (`royalty_traffic_stats_cache` y `royalty_local_traffic_events`): el número de visitas (ej. Instagram = 1) se renderiza desde el primer milisegundo sin parpadear en 0 al refrescar.
  - Eliminadas transiciones desestabilizadoras (`transition-all duration-500`) en la barra del embudo y fijada altura mínima estable en la lista de eventos para erradicar cualquier salto vertical de la pantalla.
  - Removido `animate-bounce` en las alertas del encabezado para mantener la interfaz completamente estable.

### [v2.34.0] - 2026-10-29 - Mensaje Verde de Guardado Durante 10 Segundos y Auto-Scroll Superior Automático
- **Permanencia de 10 Segundos para Mensajes de Éxito en Verde (`JobQuoteManager.tsx`):**
  - Configurado temporizador estricto de 10 segundos (`10000ms`) tanto para el mensaje superior de guardado (`saveSuccessMessage`) como para el estado visual verde de la tarjeta inferior (`savedLaterFeedback`).
  - La tarjeta inferior permanece en tono verde esmeralda con borde y anillo brillante (`bg-emerald-50 border-emerald-400 ring-4 ring-emerald-200`) durante los 10 segundos completos, confirmando la hora local exacta del usuario.
- **Navegación Asistida y Auto-Scroll Automático Superior:**
  - Se visualiza el botón *"Ver arriba ↑"* tanto en el mensaje verde de la tarjeta inferior como en el banner superior.
  - Al pulsar *"Ver arriba ↑"*, el usuario es llevado inmediatamente con scroll suave al tope (`window.scrollTo({ top: 0, behavior: 'smooth' })`) enfocando el panel `#cotizaciones-por-enviar-panel`.
  - Si el usuario **no** presiona *"Ver arriba ↑"*, el sistema ejecuta un temporizador de 3 segundos que desplaza la pantalla automáticamente hacia arriba, permitiendo apreciar la confirmación en la tarjeta y luego revisarla en la lista de cotizaciones por enviar.

### [v2.33.0] - 2026-10-29 - Precios Visibles en los 3 Servicios con Edición Dinámica en Tiempo Real por el Administrador
- **Visualización de Precios a la Par en los 3 Servicios (`ServicesSection.tsx`):**
  - Añadido el precio comercial a la par en cada una de las 3 tarjetas de servicio principales:
    - *Detección Especializada de Fugas:* `₡45,000`
    - *Rastreo y Diagnóstico de Tuberías:* `₡35,000`
    - *Limpieza Técnica de Tuberías:* `₡25,000`
  - Se muestra con etiqueta visual doble: píldora verde esmeralda superior junto a la insignia (`Alta Precisión | ₡45,000`) y bloque de tarifa base a la par del título del servicio.
  - Sincronización en tiempo real mediante `api.getServices()` y evento reactivo `royalty_services_updated`.
- **Edición Rápida de Precios por el Administrador (`ServicesCatalogManager.tsx`):**
  - Incorporado botón *"Cambiar Precio"* y editor numérico directo en cada servicio dentro del panel administrativo (`/detec/panel?tab=settings`).
  - Al cambiar y guardar el precio, el sistema actualiza la base de datos Cloudflare D1 y el almacenamiento local de forma inmediata con confirmación visual (*"¡Precio Guardado!"*).
- **Extensión de API y Base de Datos D1 (`[[route]].ts` / `api.ts` / `appointment.ts`):**
  - Añadido soporte para columna `price` en la tabla `services` y nuevo endpoint `PATCH /api/services/:id`.
  - Reflejado el precio también en el selector del formulario de reserva (`StepClientDetails.tsx`).

### [v2.32.0] - 2026-10-29 - Desplazamiento Automático Superior al Confirmar Cita (Sin Scroll Manual)
- **Auto-Scroll Inmediato hacia la Confirmación Superior (`BookingWizard.tsx` / `StepConfirmation.tsx`):**
  - Implementado desplazamiento automático instantáneo y suave (`window.scrollTo({ top: 0, behavior: 'smooth' })`) en `handleSubmit` al confirmarse la cita.
  - Añadido `useEffect` de auto-posicionamiento en el montaje de `StepConfirmation`: el usuario en teléfonos móviles o PC es dirigido directamente arriba donde se muestra el distintivo *"CITA REGISTRADA CON ÉXITO"* y *"¡Gracias, [Nombre]!"*.
  - Erradicada la necesidad de que el cliente deba hacer scroll hacia arriba con el dedo o mouse para ver el comprobante y el botón de WhatsApp.

### [v2.31.0] - 2026-10-29 - Persistencia Absoluta de Pestañas y Ventanas al Refrescar (Horarios, Cotizador, Tráfico, Citas)
- **Persistencia de Pestañas en el Panel Administrativo (`AdminView.tsx`):**
  - Implementada sincronización bidireccional entre el estado `activeTab`, `localStorage` (`royalty_admin_active_tab`) y parámetros de consulta en URL (`?tab=schedule`, `?tab=quotes`, `?tab=traffic`, `?tab=all`, `?tab=route`, `?tab=settings`).
  - Al recargar la página (F5 o botón de refrescar del navegador), el sistema restaura de inmediato la pestaña activa donde se encontraba el usuario: si estaba en *Horarios*, permanece en *Horarios*; si estaba en *Cotizador*, permanece en *Cotizador*; si estaba en *Tráfico & Métricas*, permanece en *Tráfico & Métricas*.
  - Añadido soporte para los botones atrás/adelante (`popstate`) del navegador entre pestañas.
- **Preservación de Parámetros y Rutas Directas (`src/App.tsx`):**
  - Configurada preservación de parámetros de búsqueda (`searchParams`) al redirigir a `/detec/panel`, evitando pérdida de contexto.
  - Habilitados atajos limpios `/horarios`, `/trafico`, `/metricas`, `/citas` y `/ajustes` que conectan automáticamente con su pestaña correspondiente en el panel.

### [v2.30.0] - 2026-10-29 - Preservación de Todas las Cotizaciones sin Sobrescritura, Hora Real del Usuario y Subida Automática a la Notificación
- **Preservación Total de Cotizaciones en Bandeja y Base de Datos D1 (`JobQuoteManager.tsx`):**
  - Erradicado el fallo de sobrescritura: anteriormente, si el usuario modificaba el formulario para otro cliente, se reutilizaba el mismo ID anterior y borraba la cotización previa.
  - Implementada detección inteligente: si el cliente o los datos cambian respecto a una cotización ya guardada, el sistema genera automáticamente un nuevo identificador único (`targetId`) y un nuevo consecutivo (`targetQuoteNumber`), registrando cada cotización de forma acumulativa sin borrar ninguna anterior.
  - Añadido estado `editingQuoteId` con distintivo visual en cabecera (*"Modo Edición"* y botón *"Crear Otra Nueva"*).
- **Subida Automática y Enfoque Directo a la Notificación Superior (`JobQuoteManager.tsx`):**
  - Al presionar *"Guardar en Cotizaciones por Enviar"*, el sistema ejecuta un desplazamiento suave inmediato al tope absoluto de la pantalla (`window.scrollTo({ top: 0, behavior: 'smooth' })`), desplegando la notificación en verde y la bandeja de pendientes con la nueva cotización posicionada en primer lugar.
- **Hora Real y Exacta del Dispositivo del Usuario (`JobQuoteManager.tsx`):**
  - Eliminadas horas inventadas o desfases de 6 horas producidos por servidores UTC.
  - Se implementó `formatUserLocalTime` utilizando la configuración regional de Costa Rica (`es-CR`) en formato de 12 horas con AM/PM tanto en el mensaje de confirmación superior como en la tarjeta de cada cotización en la lista (`📅 29/10/2026 • 🕒 [Hora Real]`).

### [v2.29.0] - 2026-10-29 - Corrección Integral de Acción y Retroalimentación en Tarjeta Inferior "Guardar en Cotizaciones por Enviar"
- **Guardado Optimista Instantáneo y Desplazamiento Suave (`JobQuoteManager.tsx`):**
  - Corregido el flujo de ejecución en `handleSaveQuoteForLater`: ahora guarda de forma inmediata y síncrona en `localStorage` y en el estado local de cotizaciones antes del envío a la nube, erradicando congelamientos o clics sin respuesta.
  - Implementado desplazamiento suave automático (`scrollIntoView` hacia `#cotizaciones-por-enviar-panel`) al pulsar el botón inferior, llevando la vista directamente a la bandeja superior abierta donde se observa la cotización guardada y el contador de pendientes actualizado.
- **Retroalimentación Visual Inmediata en la Tarjeta Inferior (`JobQuoteManager.tsx`):**
  - Añadidos estados `savedLaterFeedback` e `isSavingLater` específicos para la tarjeta y el botón inferior.
  - Al hacer clic, el botón muestra spinner animado (*"Guardando en Cotizaciones por Enviar..."*) y al confirmarse muta a color esmeralda con checkmark (*"✅ ¡Guardada en Cotizaciones por Enviar!"*).
  - La tarjeta inferior adopta un borde verde esmeralda con resalte y despliega un banner interno de confirmación con enlace directo *"Ver Lista Arriba ↑"*, garantizando que el usuario perciba de inmediato la acción sin importar en qué parte del scroll se encuentre.

### [v2.28.0] - 2026-10-29 - Botón "Ver Cita" en Notificaciones de Nueva Cita y Navegación Directa con Resalte Visual
- **Botón Interactivo "Ver Cita" en Banner Flotante en Tiempo Real (`AdminView.tsx`):**
  - Incorporado botón de alta visibilidad *"Ver Cita"* (con ícono de ojo) en la alerta flotante naranja de nueva cita.
  - Al pulsar el botón, el sistema conmuta automáticamente a la pestaña correspondiente (`route` si la cita es para hoy, o `all` con filtros restablecidos si es para otra fecha).
  - Cierra la alerta y ejecuta un desplazamiento suave (`scrollIntoView` centrado) directo hacia la tarjeta de la cita.
  - Aplica un anillo de resalte visual dinámico (`ring-4 ring-brand-orange animate-pulse`) durante 6 segundos para identificar de inmediato la tarjeta entre el listado.
- **Identificadores DOM y Estados de Resalte en Tarjetas (`TodayRouteCard.tsx` / `AppointmentCard.tsx`):**
  - Añadida prop `isHighlighted` y atributo `id={`appointment-${appointment.id}`}` a ambas tarjetas.
  - Efecto de iluminación ámbar con sombra expandida y pulso para localización inmediata.
- **Compatibilidad con Notificaciones Push y Deep Linking (`public/sw.js` / `AdminView.tsx`):**
  - El Service Worker (`sw.js`) adjunta automáticamente el parámetro `&appointmentId=` a la URL de apertura al recibir la notificación push.
  - Detección automática al cargar o reenfocar el panel mediante parámetros de consulta (`?appointmentId=` o `?cita=`), focalizando y resaltando la cita sin intervención manual.

### [v2.27.0] - 2026-10-29 - Nueva Página Estratégica `/proyecto` con Desglose Persuasivo y Modo Desarrollador con Clave Secreta (1985)
- **Página de Alto Impacto para el Dueño del Negocio (`ProjectPresentationPage.tsx` / `src/App.tsx`):**
  - Creada ruta exclusiva responsive `/proyecto` diseñada con estética de alta gama (vino profundo `#67141d`, azul técnico y detalles dorados).
  - Redacción persuasiva orientada a la psicología del dueño del negocio (David Rojas), destacando la superioridad frente a la competencia, la erradicación de cotizaciones informales en WhatsApp y el retorno financiero inmediato.
  - Métricas visuales de impacto: cotizaciones formales en 30 segundos, cero fugas de clientes con atribución, conexión directa a WhatsApp y servidor serverless en la nube.
- **Lista Ordenada Funcionalidad por Funcionalidad (Dolor -> Solución -> Impacto):**
  - Desglose cronológico y exhaustivo de las 10 capacidades del sistema:
    1. Cotizador Formal Dinámico con Membrete Oficial y Firma de David Rojas.
    2. Previsualización Enriquecida en WhatsApp con Open Graph dinámico en el servidor.
    3. Rastreo Silencioso en Vivo de Lectura y Descarga del Documento PDF.
    4. Bandeja Inteligente de "Cotizaciones por Enviar" con contador de pendientes.
    5. Rastreador de Tráfico y Embudo de Conversión de Redes Sociales (FB, IG, WA).
    6. Agenda Técnica Inteligente con Detección Visual Ámbar de Campos Requeridos.
    7. Muro Dinámico de Reseñas y Testimonios Verificados con Slider Interactivo.
    8. Panel de Control Administrativo Integral (Modo Claro / Modo Pro).
    9. Infraestructura Serverless en la Nube Edge (Cloudflare Pages + D1).
    10. Aplicación Web Progresiva (PWA Móvil Primero Instalable).
- **Modo Desarrollador con Clave Secreta (`1985` - No Visible en Pantalla):**
  - Botón discreto con ícono de candado en la barra superior.
  - Modal con verificación de clave secreta (`1985`) con campo ofuscado (`••••`).
  - Al desbloquearse, permite editar títulos, categorías, problemas, soluciones e impactos, reordenar las tarjetas (subir/bajar) y añadir nuevas funcionalidades con persistencia en `localStorage`.
- **Enlace de Acceso en Pie de Página (`Footer.tsx`):**
  - Enlace discreto *"⚡ Arquitectura del Sistema (/proyecto)"* en la sección de navegación.

### [v2.26.0] - 2026-10-29 - Título y Previsualización Enriquecida para WhatsApp en Enlaces de Cotización
- **Servidor Edge y Metaetiquetas Dinámicas Open Graph (`functions/cotizacion/[id].ts`):**
  - Implementada función en Cloudflare Pages para la ruta `/cotizacion/:id` que consulta D1 en tiempo real y sirve etiquetas Open Graph nativas para rastreadores (WhatsApp, Facebook, Telegram).
  - Al compartir o pegar el link en WhatsApp, se genera automáticamente la tarjeta con:
    - **Título:** `📋 Cotización Oficial: [Nombre Cliente] (COT-2026-XXX)`
    - **Descripción:** `Cotización formal emitida por Royalty Destaqueos & Tuberías. Monto: ₡[Total]. Toque aquí para abrir y descargar su cotización en PDF.`
    - **Imagen:** Logotipo oficial de Royalty (`/images/logo-royalty-destaqueo.png`).
- **Simulador de Tarjeta y Copiado con Encabezado (`JobQuoteManager.tsx`):**
  - Añadida previsualización interactiva tipo WhatsApp en el modal de compartir enlace para que David vea el título exacto que verá el cliente.
  - Nuevo botón *"Copiar Enlace con Título para WhatsApp"* que copia el mensaje estructurado con consecutivo, nombre del cliente, monto cotizado y link directo.
  - Título dinámico de pestaña en el navegador del cliente (`ClientQuoteView.tsx`).
- **Etiquetas Globales Open Graph en Shell (`index.html`):**
  - Integradas metaetiquetas `og:title`, `og:description`, `og:image` y `twitter:card` en la plantilla base para que todo el dominio proyecte previsualizaciones profesionales al ser compartido.

### [v2.25.0] - 2026-10-29 - Botón "Guardar Cotización" y Sección "Cotizaciones por Enviar"
- **Botón "Guardar Cotización" (`JobQuoteManager.tsx`):**
  - Incorporado botón principal destacado en la barra superior de acciones con ícono `BookmarkPlus` y degradado ámbar para guardar la cotización directamente con estado `por_enviar`.
  - Añadida tarjeta de acción rápida al pie del formulario del editor con el mensaje *"¿Deseas enviar esta cotización más tarde?"* para guardar sin necesidad de desplazarse arriba.
  - Alerta visual inmediata de confirmación tras el guardado con consecutivo asignado (`saveSuccessMessage`).
- **Sección y Gestor "Cotizaciones por Enviar" (`JobQuoteManager.tsx`):**
  - Botón de acceso directo en la barra superior con contador en tiempo real de cotizaciones pendientes (`Por Enviar (X)`).
  - Pestañas de filtro interactivo: **"Por Enviar"** (solo pendientes) y **"Todas"** (todas las guardadas).
  - Estado vacío informativo cuando no hay cotizaciones pendientes de envío.
  - Tarjetas de cotización con identificadores visuales claros (`⏳ Por Enviar` vs `📤 Enviada`).
  - Botón directo de un clic **"Enviar WhatsApp"**: abre WhatsApp con la cotización formateada y el enlace web, y actualiza automáticamente el estado a `enviada`.
  - Acciones complementarias por tarjeta: Cargar en Editor, Copiar Enlace, Ver Online, Alternar Estado y Eliminar.
- **Persistencia en la Nube y Base de Datos D1 (`functions/api/[[route]].ts` / `src/services/api.ts`):**
  - Columna `status` (`por_enviar` / `enviada`) añadida a la tabla `quotes` en Cloudflare D1 (`legacy-fugas-db`).
  - Endpoint REST `PATCH /api/quotes/:id/status` para conmutación de estado entre por enviar y enviada.
  - Actualización automática a `enviada` cuando el cliente abre o descarga la cotización en línea.

### [v2.24.0] - 2026-10-29 - Rastreador de Tráfico, Enlaces Cortos (FB, IG, WA) y Embudo de Conversión
- **Enlaces Cortos Profesionales con Atribución Automática (`src/App.tsx` / `TrafficAnalytics.tsx`):**
  - Creadas rutas cortas oficiales directas para marketing:
    - `/fb` (Facebook): `https://legacydetec.pages.dev/fb`
    - `/ig` (Instagram): `https://legacydetec.pages.dev/ig`
    - `/wa` (WhatsApp): `https://legacydetec.pages.dev/wa`
  - Captura y persistencia de canal en `sessionStorage` (`royalty_traffic_source`) soportando tanto rutas cortas como parámetros de campaña (`?ref=fb`, `?utm_source=...`).
  - Tarjetas de copiado rápido a un solo clic y botones de prueba en el panel de administración.
- **Embudo Completo de Conversión (Funnel) por Red y General (`src/components/admin/TrafficAnalytics.tsx`):**
  - Métrica 1 (**Entraron / Visitas**): Usuarios que aterrizaron en la plataforma desde cada enlace.
  - Métrica 2 (**Dieron Clic / Interés**): Usuarios que interactuaron y abrieron la agenda interactiva.
  - Métrica 3 (**Agendaron / Conversiones**): Usuarios que completaron y confirmaron exitosamente su cita técnica.
  - Tasas calculadas en tiempo real: Tasa de Clic (% que pasó a agenda) y Tasa de Conversión (% que agendó).
  - Barra visual de retención y tabla comparativa por red social con totales y porcentajes.
- **Filtros Temporales e Individuales (`TrafficAnalytics.tsx` / `functions/api/[[route]].ts`):**
  - Filtro por período: **Semanal** (últimos 7 días), **Quincenal** (últimos 15 días), **Mensual** (últimos 30 días) y **Todo el Histórico**.
  - Filtro por red: visualización global consolidada o desglose individual por Facebook, Instagram, WhatsApp y Tráfico Directo.
  - Stream de eventos en vivo con badges, procedencia y marca de tiempo relativa en tiempo real.
- **Persistencia en Base de Datos D1 (`functions/api/[[route]].ts` / `src/services/api.ts`):**
  - Tabla `traffic_events` en Cloudflare D1 (`legacy-fugas-db`) con índices optimizados por fuente y fecha.
  - Endpoints REST `POST /api/traffic/event` y `GET /api/traffic/stats` con cálculo y agregación en el borde (Edge).
  - Atribución automática enlazada en `api.createAppointment` para registrar conversiones de cita con la fuente original de la sesión.

### [v2.23.0] - 2026-10-29 - Redes Oficiales con Logos, WhatsApp Directo, Escudo León en Pie de Página y Cotización en 1 Sola Hoja
- **Sustitución de Banner por Canales Oficiales y WhatsApp Directo (`JobQuoteManager.tsx` / `ClientQuoteView.tsx`):**
  - Removido el banner de imagen estático de las cotizaciones.
  - Implementados enlaces con sus logotipos oficiales correspondientes:
    - **Facebook Oficial:** `https://www.facebook.com/profile.php?id=61588596020935` (ícono oficial azul).
    - **Instagram Oficial:** `https://www.instagram.com/legacy.deteccion` (ícono gradiente oficial).
    - **Botón WhatsApp Directo:** Conexión directa al WhatsApp de David (`+506 6408-0124`) con mensaje precargado con el número de cotización y nombre del cliente.
- **Escudo León en la Parte Inferior de las Páginas (`logo-royalty-shield.png`):**
  - Incorporado el nuevo logo del escudo con león coronado en color vino (`public/images/logo-royalty-shield.png`).
  - Añadido en la parte inferior de las páginas: pie de página de la web principal (`Footer.tsx`), pie de las cotizaciones (`JobQuoteManager.tsx` / `ClientQuoteView.tsx`), pie de agenda (`AgendaPage.tsx`) y pie de calificaciones (`ClientReviewPage.tsx`).
- **Cotización Compacta en 1 Sola Hoja (Hasta 7 Ítems de Alcance) (`src/index.css` / `JobQuoteManager.tsx` / `ClientQuoteView.tsx`):**
  - Reajuste métrico de espaciados, paddings y alturas en tablas y listas.
  - Garantiza que con hasta 7 ítems de alcance técnico la cotización encaje completa y perfectamente en una única plana de impresión/PDF (`page-break-inside: avoid`), eliminando saltos de página indeseados.
- **Difuminado Profesional en la Cabecera de la Cotización (`ClientQuoteView.tsx` / `JobQuoteManager.tsx`):**
  - Añadido difuminado ambiental de alta gama (*ambient diffuse glow*) con degradados suaves en tonos vino `#67141d` y azul técnico `#0066CC` con desenfoque (`blur-2xl` y `blur-3xl`) que realza la cabecera de la hoja membretada.

### [v2.22.0] - 2026-10-29 - Cotizador Dinámico con Enlace Compartible, Visualizador para Clientes y Rastreo de Descarga en Vivo
- **Persistencia en la Nube y Base de Datos D1 (`functions/api/[[route]].ts` / `src/services/api.ts`):**
  - Creada tabla `quotes` en Cloudflare D1 (`legacy-fugas-db`) con columnas de metadatos, alcance, montos, métricas de apertura (`view_count`), estado de descarga (`is_downloaded`) y fecha/hora (`downloaded_at`).
  - Implementados endpoints REST: `GET /api/quotes`, `GET /api/quotes/:id` (con auto-incremento de visualizaciones), `POST /api/quotes` (guardado/actualización en la nube) y `POST /api/quotes/:id/downloaded` (registro de descarga).
- **Vista Oficial Dinámica para Clientes (`ClientQuoteView.tsx` / `src/App.tsx`):**
  - Creada ruta pública responsive `/cotizacion/:id` donde el cliente puede consultar la cotización formal con diseño membretado oficial, desglose y botón de aceptación por WhatsApp.
  - Al pulsar "Descargar Cotización (PDF)", la vista cliente ejecuta el registro silencioso en el backend D1 marcando la cotización como descargada con timestamp y lanza la descarga/impresión limpia del documento PDF con su nombre formal.
- **Rastreo de Descargas y Notificaciones en Vivo para David (`JobQuoteManager.tsx`):**
  - **Botón "Compartir Enlace":** Guarda automáticamente en la nube y copia al portapapeles el enlace único del cliente (`https://legacydetec.pages.dev/cotizacion/:id`).
  - **Notificaciones en Tiempo Real:** Si el cliente ya descargó la cotización, aparece una alerta visible indicando la fecha y hora de descarga para advertir antes de modificar costos o alcances.
  - **Etiquetas de Estado Dinámicas:** Muestra insignias en vivo: `✅ Descargada por el cliente`, `👁️ Vista por el cliente (X visitas - Sin descargar)` o `⏳ Enlace listo / Pendiente`.
  - **Integración con WhatsApp:** El mensaje autogenerado incluye el enlace dinámico oficial para consulta y descarga inmediata por parte del cliente.

### [v2.21.0] - 2026-10-29 - Eliminación de la Etiqueta "Cotización Formal" en Hoja de Cotizaciones
- **Ajuste de Cabecera en Cotizaciones (`JobQuoteManager.tsx`):**
  - Removida la pastilla decorativa *"COTIZACIÓN FORMAL"* tanto de la hoja imprimible interactiva como de la exportación en archivo HTML autónomo.
  - La esquina superior derecha ahora muestra directamente el consecutivo en tipografía nítida (`COT-2026-XXX`), la fecha y el período de validez sin sobrecarga textual.

### [v2.20.0] - 2026-10-29 - Aislamiento Quirúrgico de Impresión Oficial y Descarga con Nombre Personalizado
- **Aislamiento Absoluto de Impresión (`src/index.css` / `JobQuoteManager.tsx`):**
  - Implementada regla de aislamiento `@media print` universal que oculta todo elemento del sitio web (`body * { visibility: hidden !important }`) y visibiliza única y exclusivamente la hoja membretada oficial (`#printable-quote-sheet`).
  - Posicionamiento forzado en coordenadas `(0,0)` sin cabeceras, botones, barras de navegación ni fondos de la página web.
- **Guardado y Descarga con Nombre Personalizado (`JobQuoteManager.tsx` / `types/quote.ts`):**
  - Añadido modal intuitivo "Descargar / Guardar" que permite definir el nombre del archivo (ej. `Cotizacion-David-Rojas-Familia-Cordero`).
  - **Guardado en el Sistema:** Persiste la cotización con su nombre en un historial accesible (`localStorage`) con fecha, cliente y total.
  - **Descarga como PDF Oficial:** Asigna automáticamente el nombre personalizado al diálogo de impresión del navegador (`document.title = fileName`).
  - **Descarga en HTML Independiente:** Descarga directa de archivo `.html` membretado autónomo con estilos inline para consulta sin internet.
  - **Historial de Cotizaciones:** Panel desplegable con contador de cotizaciones guardadas para cargarlas, reeditarlas o descargarlas en cualquier momento.

### [v2.19.0] - 2026-10-29 - Resaltado Visual Anaranjado de Campos Faltantes y Botones Activos con Guía en Agenda
- **Resaltado Inteligente de Campos Pendientes (`StepClientDetails.tsx`):**
  - Todo campo obligatorio incompleto (Nombre, Teléfono, Descripción y Dirección) se resalta con borde y sombra suave anaranjada (`border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/50`) y la pastilla *"Falta rellenar"*.
  - Al hacer clic o enfocar el campo, la advertencia anaranjada se retira de inmediato (`border-brand-blue ring-2 ring-brand-blue/20`) y pasa a *"Escribiendo..."* para permitir el llenado limpio.
  - Al completar los caracteres mínimos requeridos, cambia instantáneamente al verde con checkmark *"Listo"*.
- **Interacción Reactiva en Botones y Auto-Focus con Scroll Suave (`StepClientDetails.tsx`):**
  - Eliminado el bloqueo ciego e inerte en "Confirmar Cita (Sin Fotos)" y "Subir Fotos (Opcional)".
  - Al hacer clic sobre los botones con campos faltantes, el sistema muestra una alerta clara e informativa indicando los campos pendientes y realiza un auto-enfoque con desplazamiento suave (*smooth scroll*) directamente al primer campo que falta completar.

### [v2.18.0] - 2026-10-29 - Cotizador de Trabajos en Línea con Desglose, Logo Oficial, IVA y Exportación WhatsApp / PDF
- **Cotizador de Trabajos Automático (`JobQuoteManager.tsx` / `types/quote.ts`):**
  - Implementado sistema completo de cotizaciones automáticas en línea accesible desde el panel administrativo (`activeTab === 'quotes'`) y por ruta directa (`/cotizador`).
  - **Identidad & Logo:** Incorporado logo oficial de *Royalty Destaqueo de Tuberías* (`logo-royalty-destaqueo.png`) con subida opcional de foto o logo del negocio y restablecimiento a 1 clic.
  - **Datos Generales:** Consecutivo automático (`COT-2026-XXX`), fecha de emisión (predefinida a hoy y editable), cliente, lugar y teléfono.
  - **Alcance Línea por Línea:** Descripción dinámica del trabajo con adición y eliminación de puntos/pasos técnicos.
  - **Desglose Económico:** Mano de obra, estimado de materiales con campo de detalle, cálculo automático de subtotal, toggle de IVA (13% para Factura Electrónica) y Total General.
  - **Condiciones y Checkpoints:** Tiempo estimado de entrega editable (mismo día, 1 día, 2 días, 1 semana, personalizado) y checkpoints de garantía (100% contra entrega y satisfacción, materiales certificados, garantía por escrito y sin costos ocultos).
  - **Firma Oficial y Redes:** Bloque de firma de *David Rojas*, banner de contacto oficial (`royalty-contacto-banner.png`), enlaces a WhatsApp, Instagram, correo y sitio web.
  - **Exportación & Compartir:** Envío formateado por WhatsApp en 1 clic, impresión profesional A4/Carta (`@media print` sin elementos de interfaz) y copiado rápido al portapapeles.
  - **Persistencia Local:** Guardado automático en `localStorage` para proteger borradores activos.
- **Navegación Móvil y Escritorio (`AdminView.tsx`, `AdminBottomNav.tsx`, `App.tsx`):**
  - Integrada la pestaña "Cotizador" en la barra de navegación superior de PC y en la barra inferior móvil.
  - Rutas directas añadidas: `/cotizador`, `/cotizar`, `/presupuesto`.

### [v2.17.0] - 2026-10-28 - Slider Interactivo de Testimonios y Corrección de Caracteres en D1
- **Slider / Carrusel Interactivo de Testimonios (`TestimonialsSection.tsx`):**
  - Transformada la sección de testimonios en un carrusel dinámico y fluido con física de transición suave (`transition-transform duration-500 ease-out`).
  - Controles de navegación mediante flechas anteriores/siguientes (`ChevronLeft`, `ChevronRight`) e indicadores de puntos interactivos (*dots*).
  - Visualización adaptativa automática: 1 tarjeta en móvil, 2 en tabletas y 3 en pantallas de escritorio.
  - Soporte de gestos táctiles (*touch swipe*) para celulares y auto-avance inteligente con pausa al pasar el ratón (*hover*) y detección de pestaña oculta (*anti-drain*).
- **Corrección de Codificación y Carácter Corrupto en D1 (`legacy-fugas-db` / `TestimonialsSection.tsx`):**
  - Corregido registro en base de datos Cloudflare D1 donde `Detección` contenía el carácter de reemplazo  (`U+FFFD`).
  - Añadida función de sanitizado universal `sanitizeText()` para neutralizar cualquier carácter mal codificado futuro.

### [v2.16.0] - 2026-10-28 - Optimización de Espacios y Erradicación de Vacíos en Métricas y Finanzas
- **Reorganización del Panel de Control (`AdminView.tsx`):**
  - Desacopladas las tarjetas de métricas (`KPICards`) de la rejilla compartida, ubicándolas en su propia fila panorámica superior.
  - Eliminado el estiramiento vertical forzado (*flex stretch*) entre componentes de alturas dispares.
  - Reestructurado el bloque inferior en 2 columnas (`FinancialReportCard` y `AdminReviewsCard`) con alineación `items-start`, erradicando el espacio en blanco vacío al pie de la recaudación.
- **Optimización de Tarjetas de Métricas (`KPICards.tsx`):**
  - Eliminado el truncado de texto ("Esta Semana" ahora se muestra completo sin puntos suspensivos).
  - Altura compacta natural (~85px) sin separación exagerada (*void gap*) entre el título y el contador.
  - Espaciado responsivo optimizado (`gap-2.5 sm:gap-4`, `p-3 sm:p-4`) y tipografía escalada (`text-3xl`).

### [v2.15.0] - 2026-10-28 - Integración de Redes Sociales Oficiales (Facebook, Instagram y WhatsApp)
- **Componente Centralizado de Redes Sociales (`SocialLinks.tsx`):**
  - Creado componente reutilizable con SVGs vectoriales nativos para Facebook (`#1877F2`), Instagram (gradiente magenta-naranja característico) y WhatsApp (`#25D366`).
  - Enlaces oficiales configurados:
    - Facebook: `https://www.facebook.com/profile.php?id=61588596020935`
    - Instagram: `https://www.instagram.com/legacy.deteccion`
    - WhatsApp: `https://wa.me/50664080124`
  - Micro-interacciones de elevación suave (*hover translate* y sombras dinámicas) con apertura segura en pestaña externa (`target="_blank" rel="noopener noreferrer"`).
- **Integración en Encabezado y Menú Móvil (`Navbar.tsx`):**
  - Acceso directo visible en barra de navegación de escritorio.
  - Sección integrada "Síguenos en redes" en el cajón desplegable móvil para pantallas pequeñas.
- **Integración en Pie de Página (`Footer.tsx`):**
  - Columna principal con botones etiquetados bajo la sección de garantía.
  - Fila inferior de copyright con accesos compactos para redes sociales.

### [v2.14.0] - 2026-10-28 - Rediseño del Logo en Blanco con Aura Celeste Posterior y Luz en Detección de Fugas
- **Rediseño del Logo del Águila (`AnimatedEagleLogo.tsx`):**
  - Eliminado el recuadro celeste con círculo; el contenedor ahora es 100% blanco puro con esquinas redondeadas.
  - Implementado resplandor celeste/cian sutil (*backlight aura*) ubicado por detrás del cuadro blanco, proyectando un brillo limpio sin bordes rígidos.
- **Haz de Luz Animado en "Detección de Fugas" (`Navbar.tsx` / `HeroSection.tsx` / `AgendaPage.tsx` / `Footer.tsx`):**
  - Aplicado barrido lumínico continuo (*shimmer light sweep*) a las palabras *"Detección de Fugas"* en la barra de navegación, portada principal y secciones clave.

### [v2.13.0] - 2026-10-28 - Reducción del 45% en la Barra de Menú Superior (Navbar Compacto)
- **Compactación del Encabezado Principal (`Navbar.tsx`):**
  - Reducida la altura vertical de la barra de navegación de 80px (`h-20`) a 44-48px (`h-11 sm:h-12`), logrando exactamente una reducción de espacio del 45%.
  - Reescalado el logotipo del águila y la tipografía a proporciones ultracompactas y elegantes (`w-8 h-8`, fuentes proporcionadas y paddings ligeros).
  - Ajustados los botones de llamada, agendamiento y menú móvil para maximizar el área visible de la página web.

### [v2.12.0] - 2026-10-28 - Iluminado Especial Royality, Águila con Animación y Acordeón Exclusivo de Instalación Móvil
- **Iluminado Especial en "Royality" y "Detección de Fugas" (`Navbar.tsx` / `HeroSection.tsx` / `TechShowcase.tsx`):**
  - Implementado efecto lumínico metálico (*shimmer sweep* y resplandor cian/zafiro) en la tipografía principal con animaciones fluidas por GPU.
- **Águila Oficial con Animación Dinámica (`AnimatedEagleLogo.tsx` / `index.css`):**
  - Creado componente animado del águila con barrido de luz diagonal (*sheen*), respiración lumínica y aura pulsante en el borde.
- **Eliminación Total de PWA Pública (`Footer.tsx`):**
  - Suprimida la sección pública de "Aplicación Móvil" e instalación del pie de página; los visitantes generales ya no ven accesos de app.
- **Acordeón Exclusivo de Instalación en Panel Administrativo (`AdminSettingsTab.tsx`):**
  - Diseñado botón acordeón plegable para el administrador con botón directo de instalación en celular y guía visual paso a paso para Android (Chrome) e iPhone (Safari).

### [v2.11.0] - 2026-10-28 - Diseño Responsivo Adaptativo para PC / Computadora y Celular en el Panel Administrativo
- **Detección Automática de Dispositivo (`AdminView.tsx`):**
  - Detección reactiva de resolución y dispositivo (Computadora vs Celular) con indicador dinámico en el encabezado (`Vista PC / Escritorio` o `Vista Móvil`).
- **Navegación Superior Integrada en Computadora (`AdminView.tsx`):**
  - En pantallas de escritorio (`md:`), la navegación por pestañas se traslada a la barra superior con iconos, nombres completos y contadores en vivo.
  - La barra inferior flotante de celular (`AdminBottomNav.tsx`) se oculta automáticamente en computadoras (`md:hidden`), eliminando el aspecto de emulador estrecho.
- **Distribución en Cuadrícula Panorámica (`AdminView.tsx`):**
  - El ancho del contenedor se amplía dinámicamente (`max-w-6xl` / `xl:max-w-7xl` en PC) manteniendo el centrado móvil (`max-w-lg`) en celulares.
  - Las paradas de ruta de hoy y las citas se reorganizan en cuadrículas fluidas de 2 y 3 columnas (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`).
  - Las tarjetas de métricas, cierre financiero y reseñas de clientes se alinean horizontalmente en 3 columnas en escritorio.

### [v2.10.0] - 2026-10-28 - Sistema de Calificaciones (1-5★), Reseñas WhatsApp, Notificaciones y Publicación Inmediata
- **Ruta Exclusiva de Calificación de Clientes (`ClientReviewPage.tsx` / `/calificar`):**
  - Portal móvil limpio y accesible sin código para calificar el servicio con 1 a 5 estrellas doradas interactivas, nombre del cliente, tipo de servicio y comentario de experiencia.
  - Pre-llenado automático de nombre y servicio mediante parámetros de enlace (`?id=...&cliente=...&servicio=...`).
  - Al enviar, se guarda de inmediato en D1 y muestra pantalla de agradecimiento con opción de ver el testimonio en la web o cerrar la ventana.
- **Generación y Envío de Enlace por WhatsApp (`AppointmentCard.tsx` / `TodayRouteCard.tsx`):**
  - Botón integrado en cada cita (`Enviar Link de Calificación (1-5★) por WhatsApp`) que abre WhatsApp Web/App con un mensaje personalizado y el enlace exclusivo del cliente.
- **Módulo de Gestión de Reseñas en el Panel (`AdminReviewsCard.tsx`):**
  - Métricas de opiniones totales, promedio de estrellas, visor de testimonios recientes y botón para copiar enlace general al portapapeles.
- **Notificación en Vivo de Nuevas Reseñas (`AdminView.tsx` / `useReviews.ts`):**
  - Banner interactivo en tiempo real con alerta auditiva (`playNotificationChime()`) que notifica al administrador cuando entra un nuevo comentario o calificación.
- **Sección Pública de Testimonios Verificados (`TestimonialsSection.tsx`):**
  - Carga reactiva de testimonios reales desde `/api/reviews` con insignia *"Verificado"*, fecha y calificación, combinada armónicamente en el sitio oficial.

### [v2.9.0] - 2026-10-28 - Registro de Monto Cobrado, Medio de Pago (Sinpe Móvil / Tarjeta / Efectivo) y Reportes Financieros
- **Registro de Cobro en Citas (`PaymentModal.tsx`):**
  - Modal interactivo con entrada de monto en Colones (₡), chips de monto rápido (₡25.000, ₡35.000, ₡45.000, ₡60.000, ₡80.000) y selector de método de pago: Sinpe Móvil, Tarjeta o Efectivo.
  - Disponible tanto en el flujo de ruta callejera (`TodayRouteCard.tsx`) como en el listado general (`AppointmentCard.tsx`).
- **Persistencia en Cloudflare D1 (`functions/api/[[route]].ts`):**
  - Columnas `amount_collected` (REAL) y `payment_method` (TEXT) migradas y sincronizadas en la base de datos remota D1.
  - Endpoint `PATCH /appointments/:id` actualizado para registrar montos y medios de pago en tiempo real.
- **Reporte Financiero Diario y Semanal (`FinancialReportCard.tsx`):**
  - Tarjeta de balance financiero con selector "Cierre de Hoy" y "Esta Semana" (lunes a domingo).
  - Desglose detallado de ingresos totales acumulados y distribución por método: Sinpe Móvil, Tarjeta bancaria y Efectivo.
  - Integrado de forma visible en el plan de ruta de hoy y en la vista general del panel.

### [v2.8.0] - 2026-10-28 - Intervalos Configurables por Bloque: Cuarta Opción y Personalización Libre
- **Ampliación de Opciones Predeterminadas (`AvailabilityManager.tsx`):**
  - Añadida una 4ta opción estándar (4 horas / 240 min) e intervalos de 1 hora (60 min), 1.5 horas (90 min), 2 horas (120 min) y 3 horas (180 min).
- **Modo Personalizado Libre de Minutos:**
  - Incorporado selector con panel interactivo que permite ingresar cualquier cantidad exacta de minutos por bloque (ej. 45, 75, 105, 150 min) con pastillas de selección rápida.
- **Previsualización Reactiva y Anulación por Día Específico:**
  - Los bloques horarios del día se recalculan en tiempo real según el intervalo seleccionado.
  - El planificador *"Mañana voy a trabajar"* permite además sobrescribir el intervalo para una fecha específica sin alterar la regla global.

### [v2.7.0] - 2026-10-28 - Aislamiento del Panel Admin en URL Separada `/detec/panel` con Formulario de Usuario y Contraseña
- **Ruta Exclusiva Separada `/detec/panel` (`App.tsx`):**
  - El acceso administrativo y el inicio de sesión ya no operan como modal superpuesto en la misma URL; ahora residen en su propia URL dedicada `/detec/panel`.
  - Redirección automática de comodines `/detec`, `/panel`, `/admin` hacia la ruta canónica `/detec/panel`.
- **Formulario de Usuario y Contraseña (`AdminLogin.tsx`):**
  - Rediseñada la pantalla de acceso con campos formales de Usuario (`admin`) y Contraseña (`1234` o configurada) con opción para mostrar/ocultar clave.
  - Alternador hacia teclado numérico PIN rápido para cuando el técnico se encuentra en calle y necesita desbloqueo con una sola mano.
  - Botón directo para volver a la página principal del sitio web.

### [v2.6.0] - 2026-10-28 - Simplificación de Almacenamiento Cero Basura e Historial de Borrado de Datos
- **Eliminación de Tecnicismos de Infraestructura (`StorageManager.tsx`):**
  - Removidas todas las referencias a "Cloudflare 2" (R2) y "Cloudflare 1" (D1).
  - Texto conciso e intuitivo para el administrador: *"La limpieza se ejecuta automáticamente 24 horas después de agendar la cita"*.
- **Eliminación del Botón Manual Innecesario:**
  - Suprimido el botón *"Limpiar fotos y datos antiguos ahora"*, ya que la depuración opera de forma 100% automática y desatendida.
- **Nuevo Historial de Borrado de Datos en el Panel:**
  - Incorporada lista con el historial de citas cuyos archivos pesados y fotos fueron liberados tras 24 horas.
  - El administrador confirma que los archivos fueron depurados del almacenamiento, manteniendo los registros intactos en su panel para su control contable.

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
