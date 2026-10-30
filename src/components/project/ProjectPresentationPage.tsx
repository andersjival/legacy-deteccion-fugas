import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Edit3, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  FileText, 
  Share2, 
  Eye, 
  Clock, 
  BarChart3, 
  Calendar, 
  Star, 
  Cpu, 
  Smartphone, 
  Check, 
  X, 
  ChevronRight, 
  TrendingUp, 
  Award, 
  DollarSign,
  Layers,
  ShieldCheck,
  CheckSquare,
  BadgeCheck,
  Server,
  Boxes,
  Fuel,
  Utensils,
  Receipt,
  Banknote,
  CreditCard
} from 'lucide-react';
import { ProjectFeature, ProjectMetric, ProjectPresentationData } from '../../types/project';

const STORAGE_KEY = 'royalty_project_presentation_data_v5';
const SHIELD_LOGO = '/images/logo-royalty-shield.png';
const LOGO_DESTAQUEO = '/images/logo-royalty-destaqueo.png';

export interface DeliverableSummaryItem {
  id: string;
  pillar: string;
  title: string;
  tag: string;
  tagColor: string;
  summary: string;
  bullets: string[];
  actionPath?: string;
  actionText?: string;
}

export const DELIVERABLES_SUMMARY: DeliverableSummaryItem[] = [
  {
    id: 'del_1',
    pillar: '1. MOTOR COMERCIAL & CIERRE',
    title: 'Genera Cotizaciones en Solo 5 Minutos con el Cotizador Dinámico',
    tag: 'Cierre en Caliente',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    summary: 'Genera propuestas técnicas altamente persuasivas y con membrete formal en solo 5 minutos desde tu celular. Diseñado para cerrar contratos en caliente durante la visita técnica antes de que el cliente busque a otros competidores.',
    bullets: [
      'Emisión formal de cotización completa en solo 5 minutos desde el vehículo',
      'Desglose automático de mano de obra, materiales, garantía por escrito y membrete oficial',
      'Erradica el regateo de precios y proyecta la máxima categoría corporativa'
    ],
    actionPath: '/cotizador',
    actionText: 'Probar Cotizador'
  },
  {
    id: 'del_2',
    pillar: '1. MOTOR COMERCIAL & CIERRE',
    title: 'Previsualización Enriquecida Automática en WhatsApp (Open Graph)',
    tag: 'Apertura >95%',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    summary: 'Inyección dinámica de tarjeta visual oficial con el logotipo de Royalty y el monto cotizado al compartir el enlace en WhatsApp.',
    bullets: [
      'El cliente ve el monto oficial y tu logo antes de abrir el enlace',
      'Elimina enlaces sospechosos o textos genéricos que parecen spam',
      'Distinción visual inmediata sobre cualquier competidor tradicional'
    ],
    actionPath: '/cotizador',
    actionText: 'Ver Ejemplo'
  },
  {
    id: 'del_3',
    pillar: '1. MOTOR COMERCIAL & CIERRE',
    title: 'Radar Silencioso de Lectura y Descarga de Cotizaciones',
    tag: 'Ventaja Táctica',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    summary: 'Registro en tiempo real que te avisa cuándo el cliente abre la cotización y la fecha/hora exacta en que descargó el documento oficial.',
    bullets: [
      'Alerta inmediata en tu panel cuando el cliente revisa los precios',
      'Permite llamar para cerrar en el momento psicológico exacto',
      'Cero llamadas a ciegas o dudas sobre el interés del cliente'
    ],
    actionPath: '/cotizador',
    actionText: 'Ver Radar'
  },
  {
    id: 'del_4',
    pillar: '2. OPERACIÓN DIARIA & CONTROL',
    title: 'Bandeja Inteligente de "Cotizaciones por Enviar"',
    tag: 'Cero Pérdida de Dinero',
    tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    summary: 'Buzón con contador visual para guardar cotizaciones borrador mientras estás en la calle y despacharlas por WhatsApp con un toque.',
    bullets: [
      'Cero dinero perdido por olvidos administrativos o notas en papel',
      'Cotiza en el vehículo o taller y envía a clientes en segundos',
      'Control total de propuestas pendientes para no descuidar ninguna'
    ],
    actionPath: '/cotizador',
    actionText: 'Ver Bandeja'
  },
  {
    id: 'del_5',
    pillar: '2. OPERACIÓN DIARIA & CONTROL',
    title: 'Hoja de Rutas del Día con Conexión a Waze y Maps en 1 Toque',
    tag: 'Eficiencia en Calle',
    tagColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    summary: 'Agenda organizada por turnos con botón de Waze directo, mapa interactivo GPS y registro de fotos de inspección técnica.',
    bullets: [
      'Navegación al domicilio del cliente con un solo clic en pantalla',
      'Reporte financiero diario y semanal de cobros realizados',
      'Historial completo de clientes, direcciones y fotografías técnicas'
    ],
    actionPath: '/detec/panel',
    actionText: 'Ver Rutas'
  },
  {
    id: 'del_6',
    pillar: '2. OPERACIÓN DIARIA & CONTROL',
    title: 'Control de Ingresos (Diario, Semanal, Mensual) y Gastos de Ruta con Comprobantes',
    tag: 'Control Financiero Total',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    summary: 'Panel financiero centralizado para monitorear ingresos diarios, semanales y mensuales (Sinpe Móvil, Tarjeta, Efectivo) y registrar gastos de operación (gasolina, alimentación y peajes) subiendo la foto del comprobante directamente en la app.',
    bullets: [
      'Registro contable exacto de ingresos diarios, semanales y mensuales en tiempo real',
      'Subida de fotos de facturas y tiquetes de gasolina y comida desde la cámara del celular',
      'Cálculo automático de ganancia neta líquida para saber exactamente cómo va el negocio'
    ],
    actionPath: '/detec/panel',
    actionText: 'Ver Control de Ingresos'
  },
  {
    id: 'del_7',
    pillar: '3. CAPTACIÓN & REPUTACIÓN',
    title: 'Rastreador de Tráfico y Atribución Exacta (FB, IG, WA)',
    tag: 'Marketing de Alta Precisión',
    tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    summary: 'Enlaces inteligentes (/fb, /ig, /wa) que rastrean el embudo: visitas, cotizaciones generadas y citas concretadas por cada canal.',
    bullets: [
      'Sabes con certeza matemática qué red social genera más dinero',
      'Filtros analíticos en vivo: semanales, quincenales y mensuales',
      'Cero inversión perdida en anuncios que no traen contratos reales'
    ],
    actionPath: '/detec/panel',
    actionText: 'Ver Analítica'
  },
  {
    id: 'del_8',
    pillar: '3. CAPTACIÓN & REPUTACIÓN',
    title: 'Agenda Interactiva Online 24/7 con Detección Visual',
    tag: 'Cero Fricción',
    tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    summary: 'Formulario con guía visual inteligente y mapa GPS que guía al cliente paso a paso y despacha la cita técnica al WhatsApp de David.',
    bullets: [
      'Tus clientes nunca se pierden: validación visual clara de campos',
      'Aumento del 40% en reservas concretadas directamente en la web',
      'Recepción inmediata de los datos en WhatsApp listos para confirmar'
    ],
    actionPath: '/agenda',
    actionText: 'Abrir Agenda'
  },
  {
    id: 'del_9',
    pillar: '3. CAPTACIÓN & REPUTACIÓN',
    title: 'Muro de Reseñas Verificadas con Candado Anti-Fraude Telefónico',
    tag: 'Reputación Blindada',
    tagColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    summary: 'Portal de testimonios con validación cruzada: solo los números de teléfono con citas reales en Royalty pueden publicar opiniones.',
    bullets: [
      'Protección total contra comentarios falsos de competidores',
      'Prueba social auténtica con estrellas, fecha y tipo de trabajo',
      'Destruye las dudas del cliente antes de la primera llamada'
    ],
    actionPath: '/calificar',
    actionText: 'Ver Reseñas'
  },
  {
    id: 'del_10',
    pillar: '4. TECNOLOGÍA MÓVIL & ENTREGA',
    title: 'Aplicación Web Progresiva (PWA Móvil Primero)',
    tag: 'Instalación en 1-Clic',
    tagColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    summary: 'Tecnología PWA instalable con icono directo en la pantalla del celular sin pagar licencias de App Store ni Play Store.',
    bullets: [
      'Acceso instantáneo desde el bolsillo para el técnico y clientes VIP',
      'Estrategia Network-First que siempre muestra datos frescos',
      'Presencia permanente en la pantalla de inicio del teléfono'
    ],
    actionPath: '/',
    actionText: 'Probar App'
  },
  {
    id: 'del_11',
    pillar: '4. TECNOLOGÍA MÓVIL & ENTREGA',
    title: 'Despliegue Llave en Mano en Producción',
    tag: 'Listo para Facturar',
    tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    summary: 'Plataforma 100% operativa y verificada en producción, lista para generar cotizaciones y captar clientes desde el primer día.',
    bullets: [
      'Sin configuraciones complejas ni instalaciones técnicas por tu cuenta',
      'Calibración continua y soporte técnico garantizado',
      'Puesta en marcha inmediata con dominio y sistemas activos'
    ],
    actionPath: '/proyecto',
    actionText: 'Propuesta'
  }
];

export const EXECUTIVE_CHECKLIST = [
  'Generador de Cotizaciones en Solo 5 Minutos con Cotizador Dinámico: propuestas comerciales persuasivas con membrete corporativo, cálculo automático de insumos, desglose de IVA y cláusulas de garantía para cerrar contratos en caliente.',
  'Control Total de Ingresos (Diario, Semanal y Mensual) y Registro de Gastos de Ruta: balance contable en tiempo real por Sinpe Móvil, tarjeta y efectivo, con subida de fotos de comprobantes de gasolina y alimentación.',
  'Tarjetas Open Graph Dinámicas para que cada cotización compartida en WhatsApp muestre el logotipo oficial y monto cotizado antes de abrirse.',
  'Radar de Visitas y Descargas que te notifica en vivo cuándo el cliente está leyendo la propuesta para llamarlo en el momento ideal.',
  'Bandeja de Cotizaciones Pendientes para guardar borradores en la calle y despacharlos en segundos sin perder clientes.',
  'Atribución de Redes Sociales con enlaces cortos (/fb, /ig, /wa) que miden visitas, cotizaciones y citas reales de cada canal publicitario.',
  'Agenda de Reservas 24/7 interactiva con validación visual intuitiva que despacha citas confirmadas directo a tu WhatsApp.',
  'Sistema de Testimonios Verificados con blindaje estricto que solo permite calificar a números registrados con citas previas.',
  'Panel Administrativo Todo-en-Uno (Modo Claro y Pro) con vista de rutas, cobros, base de datos y control de disponibilidad.',
  'Aplicación Web PWA instalable en 1 clic en la pantalla de inicio del celular, con funcionamiento rápido y soporte offline.',
  'Despliegue Llave en Mano verificado en producción, listo para facturar y con soporte técnico de calibración continua.'
];

export const COMPARISON_ROWS = [
  {
    feature: 'Velocidad de Carga en Celular',
    traditional: 'Lenta (4 a 7 segundos en WordPress o servidores compartidos)',
    royalty: 'Ultra rápida (<0.5 segundos en Nube Serverless Distribuida)',
  },
  {
    feature: 'Presentación de Cotizaciones',
    traditional: 'Audios informales, textos sueltos o demoras de horas/días que enfrían la venta',
    royalty: 'Cotización persuasiva en 5 min con membrete, firma, cálculo de insumos y garantía',
  },
  {
    feature: 'Control de Ingresos y Gastos',
    traditional: 'Cuadernos arrugados, notas dispersas y facturas de gasolina perdidas',
    royalty: 'Balance diario, semanal y mensual con subida de fotos de comprobantes en la app',
  },
  {
    feature: 'Seguimiento del Cliente',
    traditional: 'A ciegas: sin saber si el cliente abrió la cotización o la ignoró',
    royalty: 'Radar en vivo: notificación exacta cuando lee y descarga el documento',
  },
  {
    feature: 'Captación en Redes Sociales',
    traditional: 'Gastos a ciegas sin saber si Facebook, Instagram o WhatsApp traen clientes',
    royalty: 'Rastreo exacto del embudo (/fb, /ig, /wa) con citas reales por red social',
  },
  {
    feature: 'Gestión Operativa de Calle',
    traditional: 'Cuadernos viejos, notas en el teléfono y citas traspapeladas',
    royalty: 'Panel centralizado con rutas del día, cobros Sinpe y Waze en 1 toque',
  },
  {
    feature: 'Costos Fijos Mensuales',
    traditional: '$25 a $50 mensuales obligatorios en hosting, plugins y licencias',
    royalty: '$0 mensuales en hosting serverless global de alta disponibilidad',
  },
  {
    feature: 'Propiedad del Sistema',
    traditional: 'Dependiente de terceros y plantillas que caducan o se rompen',
    royalty: 'Activo 100% propio de Royalty con código moderno sin mensualidades',
  }
];

const DEFAULT_METRICS: ProjectMetric[] = [
  { value: '5 min', label: 'Cotización en Mano', sublabel: 'Propuesta Persuasiva en Caliente' },
  { value: '100% Control', label: 'Ingresos y Gastos', sublabel: 'Diario, Semanal y Mensual' },
  { value: '1-Clic', label: 'Conexión Directa', sublabel: 'WhatsApp enrutado inmediato' },
  { value: '<0.5s', label: 'Carga Ultra Rápida', sublabel: 'Infraestructura de Alta Velocidad' },
];

const DEFAULT_FEATURES: ProjectFeature[] = [
  {
    id: 'feat_1',
    order: 1,
    category: 'COMERCIAL & CIERRE DE VENTAS',
    badge: 'Cierre en Caliente en 5 Min',
    title: 'Genera Cotizaciones en Solo 5 Minutos con el Cotizador Dinámico',
    problem: 'Ya no más perder ventas por tardar horas o días redactando una cotización en una computadora, ni enviar mensajes informales por WhatsApp o notas de voz que transmiten desconfianza e invitan al regateo constante. En el sector técnico, el 80% de los clientes contratan al primer profesional que les entrega una propuesta clara, formal y convincente.',
    solution: 'Cotizador dinámico inteligente que te permite armar propuestas comerciales altamente persuasivas y con membrete corporativo en solo 5 minutos desde tu celular, justo al terminar la inspección técnica. Calcula automáticamente mano de obra, materiales, garantía por escrito y emite una presentación impecable que convence al cliente al instante y asegura el adelanto o la contratación.',
    impact: 'Multiplica la velocidad de cierre, proyecta máxima autoridad técnica y asegura los contratos más rentables antes de que el cliente busque segundas opciones.',
    actionText: 'Probar Cotizador',
    actionPath: '/cotizador'
  },
  {
    id: 'feat_control_ingresos',
    order: 2,
    category: 'FINANZAS & CONTROL DE RENTABILIDAD',
    badge: 'Control Diario, Semanal y Mensual',
    title: 'Control de Ingresos y Registro de Gastos con Subida de Comprobantes (Gasolina y Alimentación)',
    problem: 'Ya no más incertidumbre de cuánto dinero real ganaste en la semana o el mes, ni facturas de combustible arrugadas o tickets de comida perdidos en la guantera del vehículo. Sin un registro diario, los gastos operativos invisibles se comen tus utilidades sin darte cuenta.',
    solution: 'Módulo financiero integral en la aplicación que desglosa en tiempo real los ingresos diarios, semanales y mensuales recibidos por Sinpe Móvil, efectivo o tarjeta. Permite además registrar los gastos de la jornada (gasolina, alimentación de ruta, peajes, materiales) subiendo la foto del comprobante o factura directamente desde la cámara del celular para conocer tu ganancia neta líquida en todo momento.',
    impact: 'Claridad financiera absoluta, control riguroso de cada colón que entra y sale, y respaldo fotográfico de todos tus gastos operativos en el bolsillo.',
    actionText: 'Ver Control de Ingresos',
    actionPath: '/detec/panel'
  },
  {
    id: 'feat_2',
    order: 3,
    category: 'IMAGEN CORPORATIVA & MARKETING',
    badge: 'Tecnología Edge',
    title: 'Previsualización Enriquecida Automática en WhatsApp (Open Graph)',
    problem: 'Ya no más enlaces cortados o textos genéricos que parecen spam en WhatsApp y hacen dudar al cliente. Al compartir tu propuesta, tus clientes ven al instante una tarjeta impecable con tu logotipo oficial y el valor exacto cotizado.',
    solution: 'El servidor inyecta dinámicamente una tarjeta visual con el logo oficial de Royalty, título exacto "📋 Cotización Oficial: [Cliente]" y el monto cotizado. Logra una tasa de apertura superior al 95%, destacando tu empresa con una categoría visual insuperable frente a la competencia.',
    impact: 'Más del 95% de apertura y distinción de marca inmediata en cada cliente.',
    actionText: 'Ver Ejemplo',
    actionPath: '/cotizador'
  },
  {
    id: 'feat_3',
    order: 4,
    category: 'INTELIGENCIA DE VENTAS EN VIVO',
    badge: 'Ventaja Táctica',
    title: 'Rastreo Silencioso de Lectura y Descarga de Documentos',
    problem: 'Ya no más incertidumbre ni llamadas a ciegas sin saber si el cliente abrió o descargó la cotización. Ahora tienes control y visibilidad absoluta de cuándo tu cliente tiene la propuesta en sus manos para contactarlo en el momento exacto.',
    solution: 'El sistema registra en segundo plano y en vivo las visitas y la fecha/hora exacta en que el cliente descargó el PDF oficial, emitiendo una notificación instantánea en el panel para dar seguimiento oportuno en el momento psicológico ideal de cierre.',
    impact: 'Seguimiento con precisión quirúrgica en el momento exacto de mayor interés de compra.',
    actionText: 'Rastreo en Vivo',
    actionPath: '/cotizador'
  },
  {
    id: 'feat_4',
    order: 5,
    category: 'GESTIÓN OPERATIVA DIARIA',
    badge: 'Ahorro de Tiempo',
    title: 'Bandeja Inteligente de "Cotizaciones por Enviar"',
    problem: 'Ya no más papeles perdidos, notas en el celular ni cotizaciones olvidadas mientras trabajas en la calle o atiendes inspecciones. Todo queda organizado en un solo toque para cotizar desde el taller o vehículo y despachar en segundos.',
    solution: 'Bandeja centralizada "Por Enviar" con guardado a un solo clic y contador visual de pendientes para despachar por WhatsApp de inmediato. Cero dinero perdido por olvidos administrativos y organización impecable para convertir cada consulta en dinero seguro.',
    impact: 'Cero dinero perdido por olvidos administrativos y agilidad operativa inmediata.',
    actionText: 'Ver Bandeja',
    actionPath: '/cotizador'
  },
  {
    id: 'feat_5',
    order: 6,
    category: 'MÉTRICAS & MARKETING DIGITAL',
    badge: 'Retorno de Inversión',
    title: 'Rastreador de Tráfico y Embudo de Conversión (FB, IG, WA)',
    problem: 'Ya no más adivinar qué red social te deja ganancias reales y cuál solo consume tu tiempo. Ahora sabes con precisión matemática de dónde provienen las visitas, quién hace clic para cotizar y cuántos clientes agendan cita técnica.',
    solution: 'Enlaces inteligentes de marketing (/fb, /ig, /wa) con métricas en tiempo real que miden el embudo completo: visitas, cotizaciones generadas y citas concretadas. Claridad financiera total para enfocar esfuerzos y presupuesto en los canales que más dinero producen.',
    impact: 'Decisiones comerciales basadas en números exactos para maximizar el retorno de inversión.',
    actionText: 'Ver Analítica',
    actionPath: '/detec/panel'
  },
  {
    id: 'feat_6',
    order: 7,
    category: 'EXPERIENCIA DE USUARIO',
    badge: 'Cero Fricción',
    title: 'Agenda Interactiva con Detección Visual de Campos Incompletos',
    problem: 'Reservas fáciles, rápidas e inmediatas: tus clientes nunca se perderán en la web. La agenda guía al usuario de manera intuitiva y visual paso a paso, eliminando cualquier confusión, frustración o abandono antes de completar su reserva.',
    solution: 'Campos interactivos con guía visual inteligente que asisten al cliente al escribir y despachan la cita técnica directamente al WhatsApp. Aumenta un 40% las reservas confirmadas, asegurando que cada visitante complete su solicitud sin complicaciones ni llamadas previas.',
    impact: 'Aumento del 40% en reservas concretadas sin fricción para el usuario.',
    actionText: 'Abrir Agenda',
    actionPath: '/agenda'
  },
  {
    id: 'feat_7',
    order: 8,
    category: 'PRUEBA SOCIAL & CONFIANZA',
    badge: 'Reputación Blindada',
    title: 'Muro de Reseñas y Testimonios con Carrusel Dinámico',
    problem: 'Cuando tus clientes vean tus testimonios reales y calificaciones de 5 estrellas, te contratarán de inmediato y sin dudar. La prueba social auténtica genera confianza absoluta desde el primer segundo que entran a tu sitio.',
    solution: 'Muro dinámico interactivo con testimonios verificados de clientes en San José, Cartago y Heredia, con desglose de estrellas y fecha. Erradica cualquier desconfianza y blinda la reputación del negocio antes de la primera llamada técnica.',
    impact: 'Confianza inmediata y reputación blindada que destruye las objeciones del cliente.',
    actionText: 'Ver Testimonios',
    actionPath: '/calificar'
  },
  {
    id: 'feat_8',
    order: 9,
    category: 'CENTRO DE MANDO DIRECTIVO',
    badge: 'Control Total',
    title: 'Panel Administrativo Todo-en-Uno (Modo Claro / Modo Pro)',
    problem: 'Ya no más cuadernos viejos, notas en el celular ni mensajes dispersos que te hagan dudar de cuántas citas tienes en la semana. Toda la operación de tu empresa reunida en un centro de mando moderno, seguro y accesible desde cualquier lugar.',
    solution: 'Panel privado con acceso seguro, selector de modo visual, calendario cronológico de citas, base de datos de clientes, cotizador y métricas operativas. Control directivo total del negocio desde la computadora o el móvil mientras viajas a atender obras técnicas.',
    impact: 'Control corporativo total de la empresa en tiempo real desde la oficina o la calle.',
    actionText: 'Acceso Panel',
    actionPath: '/detec/panel'
  },
  {
    id: 'feat_9',
    order: 10,
    category: 'INFRAESTRUCTURA DE VANGUARDIA',
    badge: 'Grado Silicon Valley',
    title: 'Infraestructura Web de Alta Velocidad y Carga Instantánea',
    problem: 'Ya no más sitios lentos, caídas de servidor ni esperas que desesperen a los clientes. Tu empresa opera sobre infraestructura de vanguardia con máxima velocidad y seguridad bancaria.',
    solution: 'Despliegue distribuido de alta disponibilidad con máxima velocidad y seguridad bancaria HTTPS. Carga ultra rápida en menos de 0.5 segundos y blindaje contra caídas para que tu web nunca falle ante consultas de emergencia.',
    impact: 'Máxima velocidad de carga y disponibilidad 24/7 para no perder clientes.',
    actionText: 'Ver Web',
    actionPath: '/'
  },
  {
    id: 'feat_10',
    order: 11,
    category: 'TECNOLOGÍA MÓVIL MODERNA',
    badge: 'Instalación en 1-Clic',
    title: 'Aplicación Web Progresiva (PWA Móvil Primero)',
    problem: 'Ya no más costos exorbitantes en desarrollo de aplicaciones complejas que los clientes evitan descargar. Ahora cuentas con una app web moderna que tú y tus clientes instalan en 1 solo clic en la pantalla de inicio del teléfono.',
    solution: 'Tecnología PWA ligera que se instala directamente sin pasar por tiendas de aplicaciones, brindando acceso instantáneo desde el bolsillo. Presencia permanente en el teléfono de clientes recurrentes y herramientas de trabajo siempre a mano.',
    impact: 'Acceso instantáneo desde el celular y presencia directa en la pantalla del cliente.',
    actionText: 'Probar App',
    actionPath: '/'
  }
];

const INITIAL_DATA: ProjectPresentationData = {
  heroTagline: 'DOCUMENTO ESTRATÉGICO DE ARQUITECTURA & VALOR COMERCIAL',
  heroTitle: 'La Plataforma Tecnológica a Medida que Convierte a Royalty en el Líder Absoluto de Costa Rica',
  heroSubtitle: 'Diseñada exclusivamente para Royalty Detección de Fugas: automatiza la captación de clientes, erradica cotizaciones informales en mensajes de texto, rastrea cuándo tu cliente abre y descarga tus propuestas, y convierte visitas en citas técnicas pagadas.',
  metrics: DEFAULT_METRICS,
  features: DEFAULT_FEATURES,
  closingTitle: '¿Por qué este sistema no es un gasto, sino el activo más rentable de Royalty?',
  closingText: 'Una página web genérica de $100 es solo un folleto digital que nadie lee. Esta plataforma es una máquina de operaciones y ventas construida a la medida de los procesos técnicos de Royalty. Cada funcionalidad está programada para ahorrar horas de trabajo manual, proyectar máxima seriedad corporativa y asegurar que cada cliente que busque un destaqueo o detección en Costa Rica termine contratando a Royalty.',
  closingQuote: 'En el sector técnico, la empresa que cotiza formalmente en segundos y demuestra transparencia tecnológica es la que gana el 90% de los contratos de alto valor.'
};

interface ProjectPresentationPageProps {
  onBackToHome: () => void;
  onNavigateAgenda: () => void;
  onOpenAdmin: () => void;
}

export const ProjectPresentationPage: React.FC<ProjectPresentationPageProps> = ({
  onBackToHome,
  onNavigateAgenda,
  onOpenAdmin
}) => {
  // Estado de los datos de la presentación
  const [data, setData] = useState<ProjectPresentationData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return INITIAL_DATA;
  });

  // Modo Desarrollador (Protegido por código 1985)
  const [isDevMode, setIsDevMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('royalty_dev_unlocked') === 'true';
    }
    return false;
  });

  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Edición de funcionalidad en modal
  const [editingFeature, setEditingFeature] = useState<ProjectFeature | null>(null);

  // Auto-guardar en localStorage cuando se editan datos
  const handleSaveData = (updated: ProjectPresentationData) => {
    setData(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    setSaveToast('✅ Cambios guardados correctamente en el sistema.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === '1985') {
      setIsDevMode(true);
      sessionStorage.setItem('royalty_dev_unlocked', 'true');
      setIsPasscodeModalOpen(false);
      setPasscodeInput('');
      setPasscodeError(false);
      setSaveToast('🔓 Modo Desarrollador Activado.');
      setTimeout(() => setSaveToast(null), 3000);
    } else {
      setPasscodeError(true);
      setPasscodeInput('');
    }
  };

  const handleLockDevMode = () => {
    setIsDevMode(false);
    sessionStorage.removeItem('royalty_dev_unlocked');
    setSaveToast('🔒 Modo Desarrollador Bloqueado.');
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleResetToDefault = () => {
    if (confirm('¿Desea restablecer toda la presentación a los textos originales recomendados?')) {
      setData(INITIAL_DATA);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      setSaveToast('🔄 Presentación restablecida a valores por defecto.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  // Mover funcionalidad arriba/abajo
  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    const newFeatures = [...data.features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFeatures.length) return;
    const temp = newFeatures[index];
    newFeatures[index] = newFeatures[targetIndex];
    newFeatures[targetIndex] = temp;
    // Recalcular orden numérico
    newFeatures.forEach((f, idx) => { f.order = idx + 1; });
    handleSaveData({ ...data, features: newFeatures });
  };

  const handleDeleteFeature = (id: string) => {
    if (confirm('¿Eliminar esta funcionalidad de la lista?')) {
      const filtered = data.features.filter((f) => f.id !== id);
      filtered.forEach((f, idx) => { f.order = idx + 1; });
      handleSaveData({ ...data, features: filtered });
    }
  };

  const handleSaveFeatureEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;
    const updatedFeatures = data.features.map((f) => 
      f.id === editingFeature.id ? editingFeature : f
    );
    handleSaveData({ ...data, features: updatedFeatures });
    setEditingFeature(null);
  };

  const handleAddNewFeature = () => {
    const newId = `feat_${Date.now()}`;
    const newFeature: ProjectFeature = {
      id: newId,
      order: data.features.length + 1,
      category: 'NUEVA CAPACIDAD TÉCNICA',
      badge: 'Funcionalidad',
      title: 'Nueva Funcionalidad del Sistema',
      problem: 'Descripción del dolor o problema que resuelve en la operación diaria.',
      solution: 'Descripción de cómo el software soluciona este aspecto de forma automatizada.',
      impact: 'Impacto directo en ingresos, ahorro de tiempo o prestigio para el negocio.',
      actionText: 'Explorar',
      actionPath: '/'
    };
    handleSaveData({ ...data, features: [...data.features, newFeature] });
    setEditingFeature(newFeature);
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 selection:bg-brand-blue selection:text-white pb-24">
      
      {/* Toast Flotante */}
      {saveToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* BARRA SUPERIOR DISCRETA Y NAVEGACIÓN */}
      <header className="sticky top-0 z-40 bg-[#070D18]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Inicio</span>
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <img src={SHIELD_LOGO} alt="Royalty" className="w-5 h-6 object-contain" />
              <span className="text-xs font-black tracking-wider uppercase text-slate-200 hidden md:inline">
                Royalty Destaqueos & Tuberías
              </span>
            </div>
          </div>

          {/* Navegación Rápida de la Landing Page de Ventas */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <button
              type="button"
              onClick={() => document.getElementById('cotizador-5min')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-amber-400/10 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Cotizador 5 Min</span>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('control-ingresos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 transition-colors cursor-pointer flex items-center gap-1"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Control de Ingresos</span>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('lista-funcionalidades')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              Capacidades
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('resumen-entregables')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Qué Recibes</span>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('tabla-comparativa')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-2.5 py-1 rounded-lg hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              Comparativa
            </button>
          </nav>

          {/* Acciones de la barra superior */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateAgenda}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-all cursor-pointer"
            >
              Agenda
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/cotizador';
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer shadow-xs"
            >
              Cotizador
            </button>

            {/* BOTÓN DISCRETO DE ACCESO DESARROLLADOR (NO MUESTRA EL CÓDIGO) */}
            {isDevMode ? (
              <button
                type="button"
                onClick={handleLockDevMode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-black text-amber-300 bg-amber-950/60 hover:bg-amber-900 border border-amber-600/50 transition-all cursor-pointer shadow-xs"
                title="Modo Desarrollador Activo. Haga clic para bloquear."
              >
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Modo Dev</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPasscodeModalOpen(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors cursor-pointer"
                title="Acceso Técnico"
              >
                <Lock className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}
          </div>

        </div>
      </header>

      {/* BANNER INFORMATIVO EN MODO DESARROLLADOR */}
      {isDevMode && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2 text-amber-200 text-xs font-bold flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>MODO DESARROLLADOR HABILITADO — Puedes editar textos, reordenar y agregar funcionalidades.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddNewFeature}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Funcionalidad</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-16 sm:space-y-20">
        
        {/* ========================================================
            HERO PERSUASIVO DE ALTO IMPACTO PARA DAVID ROJAS
           ======================================================== */}
        <section className="text-center space-y-6 max-w-4xl mx-auto relative">
          
          {/* Difuminados de Ambiente Vino y Azul */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#67141d]/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Pastilla de Categoría */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-black uppercase tracking-wider text-amber-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{data.heroTagline}</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            {data.heroTitle}
          </h1>

          {/* Subtítulo Persuasivo */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
            {data.heroSubtitle}
          </p>

          {/* Botones de Exploración Rápida */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                document.getElementById('lista-funcionalidades')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#67141d] to-[#8B1826] hover:opacity-95 text-white text-xs sm:text-sm font-black shadow-lg shadow-[#67141d]/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Explorar Capacidades del Sistema ({data.features.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              href="/cotizador"
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Abrir Cotizador en 5 Min</span>
            </a>
          </div>

          {/* TARJETAS DE MÉTRICAS CLAVE */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 text-left">
            {data.metrics.map((m, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-xs space-y-1 hover:border-slate-700 transition-colors"
              >
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {m.value}
                </div>
                <div className="text-xs font-black text-slate-200 uppercase tracking-wide">
                  {m.label}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {m.sublabel}
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================
            SECCIÓN DESTACADA: COTIZADOR DINÁMICO EN 5 MINUTOS (PERSUASIVO)
           ======================================================== */}
        <section id="cotizador-5min" className="scroll-mt-20 relative">
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-[#121c2e] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Velocidad de Cierre Insuperable</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                Genera Cotizaciones Persuasivas en Solo 5 Minutos con el Cotizador Dinámico
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                En servicios técnicos de alta urgencia como detección de fugas y destaqueos, <span className="text-amber-300 font-bold">el cliente contrata en caliente</span>. Si tardas horas en enviar un presupuesto o mandas un audio improvisado, el cliente busca otras empresas y empieza a comparar precios. Con tu nuevo cotizador dinámico, emites una propuesta formal, persuasiva e impecable en solo 5 minutos antes de arrancar tu vehículo.
              </p>
            </div>

            {/* Grid de 3 Pilares Persuasivos del Cotizador en 5 Minutos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-black text-lg">
                  ⚡
                </div>
                <h3 className="text-sm font-black text-white">1. Cierre en Caliente (5 Minutos)</h3>
                <p className="text-slate-300 leading-relaxed font-medium">
                  Rellenas cliente, diagnóstico y costo en solo 5 minutos desde tu celular. Tu cliente recibe un documento corporativo mientras la necesidad de solucionar el problema está en su punto máximo.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-black text-lg">
                  🛡️
                </div>
                <h3 className="text-sm font-black text-white">2. Erradica el Regateo de Precios</h3>
                <p className="text-slate-300 leading-relaxed font-medium">
                  El formato formal con membrete, logotipo de alta resolución, desglose de mano de obra y cláusula de garantía transmite tanta autoridad técnica que el cliente asume el precio sin pedir rebajas.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center font-black text-lg">
                  📱
                </div>
                <h3 className="text-sm font-black text-white">3. Despacho Directo a WhatsApp</h3>
                <p className="text-slate-300 leading-relaxed font-medium">
                  Genera una tarjeta oficial en WhatsApp y radar inteligente que te notifica en vivo el segundo exacto en que tu cliente revisa y descarga el documento para llamarlo en el momento ideal.
                </p>
              </div>
            </div>

            {/* Llamado a Probar el Cotizador */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Disponible para emitir cotizaciones al instante desde cualquier teléfono móvil o tablet.</span>
              </div>
              <a
                href="/cotizador"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Abrir y Probar Cotizador Dinámico</span>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECCIÓN DESTACADA: CONTROL DE INGRESOS Y GASTOS OPERATIVOS
           ======================================================== */}
        <section id="control-ingresos" className="scroll-mt-20 relative">
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-[#0A1424] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Finanzas Claras & Cero Fugas de Dinero</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                Control Integral de Ingresos (Diario, Semanal y Mensual) y Registro de Gastos con Comprobantes
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                Para que un negocio crezca con fuerza, el dueño necesita <span className="text-emerald-300 font-bold">saber con exactitud cómo va cada día, semana y mes</span>. Ya no dependes de cuadernos con hojas rotas ni de buscar facturas arrugadas de gasolina en la guantera: ahora llevas el control total de ingresos y gastos operativos en la misma aplicación desde tu bolsillo.
              </p>
            </div>

            {/* Showcase Visual: Comparador Ingresos vs Gastos vs Utilidad Líquida */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              
              {/* Columna Izquierda: Monitoreo de Ingresos por Períodos y Métodos */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                      ₡
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">Monitoreo de Ingresos en Vivo</h3>
                      <p className="text-[10.5px] text-slate-400 font-medium">Auditoría por período y método de pago</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
                    Tiempo Real
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Diario</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-400 block mt-1">Cierre de Hoy</span>
                    <span className="text-[9.5px] text-slate-500">Al terminar la ruta</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-2xl border border-emerald-500/30">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Semanal</span>
                    <span className="text-xs sm:text-sm font-black text-white block mt-1">Esta Semana</span>
                    <span className="text-[9.5px] text-emerald-300">Lunes a Domingo</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Mensual</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-400 block mt-1">Este Mes</span>
                    <span className="text-[9.5px] text-slate-500">Crecimiento global</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1 text-[11.5px]">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <span className="flex items-center gap-2 text-slate-200 font-bold">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sinpe Móvil</span>
                    </span>
                    <span className="font-mono font-black text-emerald-300">Identificación por número y fecha</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <span className="flex items-center gap-2 text-slate-200 font-bold">
                      <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                      <span>Tarjeta de Débito / Crédito</span>
                    </span>
                    <span className="font-mono font-black text-blue-300">Conciliación de datáfono</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <span className="flex items-center gap-2 text-slate-200 font-bold">
                      <Banknote className="w-3.5 h-3.5 text-amber-400" />
                      <span>Efectivo en Mano</span>
                    </span>
                    <span className="font-mono font-black text-amber-300">Control de caja diaria</span>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Subida de Comprobantes de Gastos (Gasolina y Alimentación) */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">Subida de Comprobantes & Gastos</h3>
                      <p className="text-[10.5px] text-slate-400 font-medium">Gasolina, alimentación, peajes e insumos</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-400/10 text-rose-300 border border-rose-400/30">
                    Foto Directa
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                      <Fuel className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white">Gastos de Gasolina / Combustible</span>
                        <span className="text-[10px] text-amber-300 font-bold">Foto del Tiquete</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                        Tomas la foto de la factura en la bomba de gasolina y se guarda de inmediato con fecha, monto y comprobante visible.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white">Alimentación y Viáticos en Ruta</span>
                        <span className="text-[10px] text-orange-300 font-bold">Respaldo Inmediato</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                        Registras los almuerzos y refrigerios técnicos del equipo en la calle para que ningún gasto quede en el aire.
                      </p>
                    </div>
                  </div>

                  {/* Fórmula de Rentabilidad */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        Cálculo Automático
                      </span>
                      <span className="text-xs sm:text-sm font-black text-white">
                        Ingresos Cobrados - Gastos de Ruta = Utilidad Neta Real
                      </span>
                    </div>
                    <span className="text-lg">🎯</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Pie de Sección con Enlace al Panel */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
              <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Disponible en el panel administrativo con acceso protegido desde móvil o PC.</span>
              </div>
              <a
                href="/detec/panel"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                <span>Abrir Control de Ingresos en el Panel</span>
              </a>
            </div>

          </div>
        </section>

        {/* ========================================================
            LISTA ORDENADA DETALLADA DE FUNCIONALIDADES (UNA POR UNA)
           ======================================================== */}
        <section id="lista-funcionalidades" className="space-y-8">
          
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-400 tracking-wider">
                <Award className="w-4 h-4" />
                <span>Desglose Funcional & Operativo</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Todas las Capacidades del Sistema ({data.features.length})
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-sm sm:text-right">
              Cada módulo resuelve un cuello de botella real en las operaciones de David Rojas.
            </p>
          </div>

          <div className="space-y-6">
            {data.features.map((feat, index) => (
              <div
                key={feat.id}
                className="bg-gradient-to-br from-slate-900/90 to-[#0A1424]/80 border border-slate-800/90 hover:border-slate-700 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 transition-all relative group"
              >
                
                {/* Cabecera de la Funcionalidad */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="font-mono text-xs sm:text-sm font-black px-3 py-1 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/30 shrink-0">
                      #{String(feat.order || index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          {feat.category}
                        </span>
                        {feat.badge && (
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-brand-blue/20 text-blue-300 border border-blue-500/30">
                            {feat.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                        {feat.title}
                      </h3>
                    </div>
                  </div>

                  {/* Acciones de la Tarjeta (Modo Dev o Modo Público) */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isDevMode && (
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleMoveFeature(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Subir orden"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveFeature(index, 'down')}
                          disabled={index === data.features.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Bajar orden"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingFeature(feat)}
                          className="px-2 py-1 rounded text-xs font-bold text-amber-400 hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                          title="Editar textos"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFeature(feat.id)}
                          className="p-1 rounded text-red-400 hover:bg-red-950/50 cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {feat.actionPath && (
                      <a
                        href={feat.actionPath}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors shadow-xs"
                      >
                        <span>{feat.actionText || 'Probar'}</span>
                        <ExternalLink className="w-3 h-3 text-amber-400" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Grid Explicativo en 2 Pasos: Adiós al Método Tradicional -> Solución Implementada & Beneficio Directo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* 1. Adiós al Método Tradicional */}
                  <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-2xl space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Adiós al Método Tradicional</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {feat.problem}
                    </p>
                  </div>

                  {/* 2. Solución Implementada & Beneficio Directo */}
                  <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-2xl space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>Solución Implementada & Beneficio Directo</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {feat.solution}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </section>

        {/* ========================================================
            SECCIÓN DE VENTA: INVENTARIO EJECUTIVO LLAVE EN MANO
            Todo Lo Que Recibe Tu Negocio (Punto por Punto)
           ======================================================== */}
        <section id="resumen-entregables" className="space-y-8 scroll-mt-20">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <Boxes className="w-4 h-4 text-amber-400" />
              <span>Inventario Ejecutivo Llave en Mano</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Todo Lo Que Estás Recibiendo: Punto por Punto
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              No estás adquiriendo un simple folleto web. Recibes un ecosistema digital de alta rentabilidad compuesto por herramientas comerciales, operativas y tecnológicas diseñadas exclusivamente a la medida de Royalty.
            </p>
          </div>

          {/* Cuadrícula de Entregables Ejecutivos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DELIVERABLES_SUMMARY.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xs flex flex-col justify-between gap-4 hover:border-amber-400/40 hover:bg-slate-900/90 transition-all shadow-card group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-extrabold text-slate-400 tracking-wider uppercase">
                      #{idx + 1} • {item.pillar}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {item.summary}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-200">
                    {item.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-300 leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {item.actionPath && (
                  <div className="pt-2">
                    <a
                      href={item.actionPath}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-amber-400 text-slate-200 hover:text-amber-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>{item.actionText || 'Ver en Vivo'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CHECKLIST EJECUTIVO RESUMIDO EN 1 SOLO BLOQUE DESTACADO */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-[#0A192F] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-amber-400" />
                  <span>Acta de Entrega Integral</span>
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  Resumen de Funcionalidades que Recibe Royalty (Checklist de Entrega)
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black self-start sm:self-auto">
                ✓ 100% Desarrollado y Operativo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {EXECUTIVE_CHECKLIST.map((text, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold text-[10px]">
                    {idx + 1}
                  </div>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ========================================================
            TABLA COMPARATIVA: SITIO WEB TRADICIONAL VS ROYALTY
           ======================================================== */}
        <section id="tabla-comparativa" className="space-y-6 scroll-mt-20">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-black uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Decisión Inteligente de Inversión</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¿Por Qué Esta Plataforma y No una Web Tradicional?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Comparativa transparente entre lo que ofrece un diseñador común vs lo que hace crecer tu negocio.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950/80 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-4 sm:px-6">Capacidad del Negocio</th>
                  <th className="py-4 px-4 sm:px-6 text-red-400 bg-red-950/10">Folleto Web Común ($100)</th>
                  <th className="py-4 px-4 sm:px-6 text-amber-300 bg-amber-950/20">Tu Plataforma Llave en Mano Royalty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-white whitespace-nowrap sm:whitespace-normal">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-400 bg-red-950/5">
                      <span className="flex items-center gap-1.5 text-red-300">
                        <X className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{row.traditional}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-slate-100 bg-amber-950/10 font-semibold">
                      <span className="flex items-center gap-1.5 text-amber-200">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                        <span>{row.royalty}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        {/* ========================================================
            CIERRE PERSUASIVO FINAL Y LLAMADO A LA ACCIÓN COMERCIAL
           ======================================================== */}
        <section className="bg-gradient-to-br from-[#67141d]/40 via-slate-900 to-[#0A192F] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10.5px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Propuesta Lista para Puesta en Marcha</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                {data.closingTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {data.closingText}
              </p>
              
              <blockquote className="border-l-2 border-amber-400 pl-3 py-1 text-xs italic text-amber-200/90 font-medium">
                "{data.closingQuote}"
              </blockquote>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-3 w-full sm:w-auto">
              <img src={LOGO_DESTAQUEO} alt="Royalty" className="w-36 sm:w-44 object-contain drop-shadow-md" />
              
              {/* Botón Principal de WhatsApp para Formalizar */}
              <a
                href="https://wa.me/50664080124?text=Hola%20David%2C%20estoy%20revisando%20la%20plataforma%20completa%20de%20Royalty%20Destaqueo%20y%20Legacy%20Fugas.%20Me%20parece%20excelente%2C%20coordinemos%20para%20formalizar%20la%20entrega%20llave%20en%20mano."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:opacity-95 text-amber-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <span>Aprobar Plataforma y Poner en Marcha</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </a>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <a href="/cotizador" className="hover:text-amber-400 transition-colors underline">Probar Cotizador</a>
                <span>•</span>
                <a href="/agenda" className="hover:text-amber-400 transition-colors underline">Ver Agenda 24/7</a>
                <span>•</span>
                <a href="/detec/panel" className="hover:text-amber-400 transition-colors underline">Panel Admin</a>
              </div>
            </div>
          </div>

        </section>

      </main>

      {/* ========================================================
          MODAL DE ACCESO DESARROLLADOR (PIN PRIVADO: 1985)
         ======================================================== */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Acceso de Desarrollador
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPasscodeModalOpen(false);
                  setPasscodeError(false);
                  setPasscodeInput('');
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Ingrese el código de seguridad para activar la edición de textos y funcionalidades.
            </p>

            <form onSubmit={handleVerifyPasscode} className="space-y-3">
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  setPasscodeError(false);
                }}
                placeholder="••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center tracking-widest text-lg font-mono text-white focus:outline-none focus:border-amber-400"
                autoFocus
              />

              {passcodeError && (
                <p className="text-[11px] text-red-400 font-bold text-center">
                  Código de acceso incorrecto.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black transition-all cursor-pointer shadow-xs"
              >
                Verificar Acceso
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL DE EDICIÓN DE FUNCIONALIDAD EN MODO DEV
         ======================================================== */}
      {editingFeature && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Editar Funcionalidad #{editingFeature.order}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingFeature(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFeatureEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 uppercase mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={editingFeature.category}
                    onChange={(e) => setEditingFeature({ ...editingFeature, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 uppercase mb-1">
                    Pastilla / Badge
                  </label>
                  <input
                    type="text"
                    value={editingFeature.badge || ''}
                    onChange={(e) => setEditingFeature({ ...editingFeature, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-400 uppercase mb-1">
                  Título de la Funcionalidad
                </label>
                <input
                  type="text"
                  value={editingFeature.title}
                  onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-amber-400 uppercase mb-1">
                  Adiós al Método Tradicional (Enfoque Persuasivo)
                </label>
                <textarea
                  rows={3}
                  value={editingFeature.problem}
                  onChange={(e) => setEditingFeature({ ...editingFeature, problem: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-blue-400 uppercase mb-1">
                  Solución Implementada & Beneficio Directo
                </label>
                <textarea
                  rows={4}
                  value={editingFeature.solution}
                  onChange={(e) => setEditingFeature({ ...editingFeature, solution: e.target.value, impact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 uppercase mb-1">
                    Texto de Acción
                  </label>
                  <input
                    type="text"
                    value={editingFeature.actionText || ''}
                    onChange={(e) => setEditingFeature({ ...editingFeature, actionText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-400 uppercase mb-1">
                    Ruta de Acción (ej. /cotizador)
                  </label>
                  <input
                    type="text"
                    value={editingFeature.actionPath || ''}
                    onChange={(e) => setEditingFeature({ ...editingFeature, actionPath: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFeature(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black cursor-pointer shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
