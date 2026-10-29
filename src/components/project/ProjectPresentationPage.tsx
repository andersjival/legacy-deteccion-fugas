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
  DollarSign
} from 'lucide-react';
import { ProjectFeature, ProjectMetric, ProjectPresentationData } from '../../types/project';

const STORAGE_KEY = 'royalty_project_presentation_data';
const SHIELD_LOGO = '/images/logo-royalty-shield.png';
const LOGO_DESTAQUEO = '/images/logo-royalty-destaqueo.png';

const DEFAULT_METRICS: ProjectMetric[] = [
  { value: '30 seg', label: 'Emisión de Cotización', sublabel: 'PDF membretado formal' },
  { value: '100%', label: 'Cero Fugas de Tráfico', sublabel: 'Atribución FB, IG y WhatsApp' },
  { value: '1-Clic', label: 'Conexión Directa', sublabel: 'WhatsApp enrutado a David' },
  { value: '<0.5s', label: 'Carga Ultra Rápida', sublabel: 'Nube Cloudflare Serverless' },
];

const DEFAULT_FEATURES: ProjectFeature[] = [
  {
    id: 'feat_1',
    order: 1,
    category: 'COMERCIAL & CIERRE DE VENTAS',
    badge: 'Herramienta de Cierre',
    title: 'Cotizador Formal Dinámico con Membrete y Firma Oficial',
    problem: 'La mayoría de empresas técnicas envían costos por mensajes informales de audio o textos sueltos en WhatsApp. Esto transmite desconfianza, fomenta el regateo constante de precios y demora días enteros en que el cliente apruebe el trabajo.',
    solution: 'Generador digital automatizado que calcula mano de obra calificada, insumos de materiales, IVA opcional (13% para factura electrónica), tiempos de entrega y garantía 100% contra entrega. Todo presentado en una elegante hoja membretada de 1 sola página lista para descargar o imprimir.',
    impact: 'Proyecta la imagen de una empresa de primer nivel con seriedad jurídica y comercial. Elimina objeciones de costo y duplica la velocidad de cierre de trabajos grandes.',
    actionText: 'Probar Cotizador',
    actionPath: '/cotizador'
  },
  {
    id: 'feat_2',
    order: 2,
    category: 'IMAGEN CORPORATIVA & MARKETING',
    badge: 'Tecnología Edge',
    title: 'Previsualización Enriquecida Automática en WhatsApp (Open Graph)',
    problem: 'Al pegar un enlace web tradicional en WhatsApp, no aparece imagen, o sale una miniatura cortada y un texto genérico que parece spam, haciendo que el cliente dude antes de pulsar el enlace.',
    solution: 'El servidor de la nube inyecta dinámicamente en tiempo real una tarjeta visual con el logotipo oficial de Royalty, el título exacto: "📋 Cotización Oficial: [Cliente] (COT-2026)" y el monto total cotizado, antes de que el cliente siquiera abra el documento.',
    impact: 'Tasa de apertura superior al 95%. Tu propuesta resalta con una categoría visual insuperable frente a cualquier fontanero o empresa tradicional.',
    actionText: 'Ver Ejemplo',
    actionPath: '/cotizador'
  },
  {
    id: 'feat_3',
    order: 3,
    category: 'INTELIGENCIA DE VENTAS EN VIVO',
    badge: 'Ventaja Táctica',
    title: 'Rastreo Silencioso de Lectura y Descarga de Documentos',
    problem: 'Enviar una propuesta y quedar a ciegas sin saber si el cliente ya la abrió, si la leyó o si la descargó, obligando a David a llamar a ciegas o escribir con insistencia incómoda.',
    solution: 'El sistema registra en segundo plano y en tiempo real el conteo de visitas del cliente y la fecha/hora exacta en que descargó el PDF oficial, mostrándole una alerta inmediata a David en su panel.',
    impact: 'David sabe con precisión quirúrgica cuándo el cliente tiene la cotización en pantalla, permitiéndole dar seguimiento en el momento psicológico ideal para cerrar el trato.',
    actionText: 'Rastreo en Vivo',
    actionPath: '/cotizador'
  },
  {
    id: 'feat_4',
    order: 4,
    category: 'GESTIÓN OPERATIVA DIARIA',
    badge: 'Ahorro de Tiempo',
    title: 'Bandeja Inteligente de "Cotizaciones por Enviar"',
    problem: 'Estar en la calle atendiendo una inspección técnica o destaqueo y olvidar cotizaciones pendientes, o perder apuntes en papeles que nunca se llegaron a enviar al cliente.',
    solution: 'Botón de guardado a un solo clic que almacena cotizaciones en una bandeja de "Por Enviar" con contador visual de pendientes. Permite revisarlas, editarlas y despacharlas por WhatsApp con un solo toque.',
    impact: 'Cero dinero perdido por olvidos administrativos. Organización impecable para cotizar en el taller o vehículo y enviar en segundos.',
    actionText: 'Ver Bandeja',
    actionPath: '/cotizador'
  },
  {
    id: 'feat_5',
    order: 5,
    category: 'MÉTRICAS & MARKETING DIGITAL',
    badge: 'Retorno de Inversión',
    title: 'Rastreador de Tráfico y Embudo de Conversión (FB, IG, WA)',
    problem: 'Gastar en publicidad o publicar en Facebook, Instagram y WhatsApp sin saber qué red social realmente trae clientes y cuál solo hace perder el tiempo.',
    solution: 'Enlaces cortos de marketing (/fb, /ig, /wa) que rastrean en vivo el embudo completo: cuántos visitantes entraron, cuántos dieron clic para cotizar y cuántos agendaron cita técnica real, con filtros semanales, quincenales y mensuales.',
    impact: 'Claridad matemática total sobre el retorno del negocio. David sabe con certeza dónde enfocar su esfuerzo comercial para generar más ingresos.',
    actionText: 'Ver Analítica',
    actionPath: '/detec/panel'
  },
  {
    id: 'feat_6',
    order: 6,
    category: 'EXPERIENCIA DE USUARIO',
    badge: 'Cero Fricción',
    title: 'Agenda Interactiva con Detección Visual de Campos Incompletos',
    problem: 'Formularios difíciles de entender donde los clientes no saben qué casillas faltan por llenar, se frustran y cierran la página sin reservar.',
    solution: 'Campos requeridos con sombreado anaranjado visual inteligente que se atenúa al escribir, validación interactiva que avisa qué dato falta antes de confirmar y envío automático de la cita al WhatsApp de David.',
    impact: 'Aumento del 40% en reservas concretadas. Cada cliente que llega a la web completa su reserva sin llamar a preguntar cómo se usa.',
    actionText: 'Abrir Agenda',
    actionPath: '/agenda'
  },
  {
    id: 'feat_7',
    order: 7,
    category: 'PRUEBA SOCIAL & CONFIANZA',
    badge: 'Reputación Blindada',
    title: 'Muro de Reseñas y Testimonios con Carrusel Dinámico',
    problem: 'El cliente que nunca ha contratado a Royalty teme ser estafado o recibir un trabajo de mala calidad si no ve testimonios de otros clientes de Costa Rica.',
    solution: 'Slider interactivo fluido con testimonios reales verificados en San José, Cartago y Heredia, con desglose de estrellas, fecha y tipo de trabajo realizado.',
    impact: 'Destruye la desconfianza del cliente al primer instante. La reputación de David queda establecida antes de la primera llamada.',
    actionText: 'Ver Testimonios',
    actionPath: '/calificar'
  },
  {
    id: 'feat_8',
    order: 8,
    category: 'CENTRO DE MANDO DIRECTIVO',
    badge: 'Control Total',
    title: 'Panel Administrativo Todo-en-Uno (Modo Claro / Modo Pro)',
    problem: 'Gestionar un negocio técnico con cuadernos viejos, notas en el celular y mensajes dispersos que impiden saber cuántas citas hay en la semana.',
    solution: 'Panel privado protegido con autenticación por clave y token, con selector de modo visual, listado cronológico de citas, base de datos de clientes, cotizaciones y métricas operativas.',
    impact: 'Control corporativo total del negocio desde cualquier computadora o desde el celular de David mientras viaja a una obra técnica.',
    actionText: 'Acceso Panel',
    actionPath: '/detec/panel'
  },
  {
    id: 'feat_9',
    order: 9,
    category: 'INFRAESTRUCTURA DE VANGUARDIA',
    badge: 'Grado Silicon Valley',
    title: 'Nube Serverless Edge Distribuida (Cloudflare Pages + Base de Datos en la Nube)',
    problem: 'Sitios en WordPress lentos que demoran 6 segundos en cargar, sufren ataques constantes o cobran mensualidades excesivas en servidores convencionales.',
    solution: 'Despliegue distribuido en más de 300 centros de datos globales con base de datos SQL distribuida de alta disponibilidad. Velocidad de carga en menos de 0.5 segundos y cifrado bancario HTTPS.',
    impact: 'Cero costos mensuales fijos de hosting o licencias. Máxima velocidad de carga que posiciona a Royalty por encima de la competencia en Google.',
    actionText: 'Ver Web',
    actionPath: '/'
  },
  {
    id: 'feat_10',
    order: 10,
    category: 'TECNOLOGÍA MÓVIL MODERNA',
    badge: 'Instalación en 1-Clic',
    title: 'Aplicación Web Progresiva (PWA Móvil Primero)',
    problem: 'Pagar miles de dólares por desarrollar apps separadas para iPhone y Android que los clientes no quieren descargar por falta de espacio.',
    solution: 'Tecnología PWA que permite instalar la plataforma con un ícono directo en la pantalla del celular de David y de sus clientes sin pasar por App Store ni Play Store.',
    impact: 'Acceso inmediato desde el bolsillo, funcionamiento ligero y presencia permanente en el teléfono de los clientes recurrentes.',
    actionText: 'Probar App',
    actionPath: '/'
  }
];

const INITIAL_DATA: ProjectPresentationData = {
  heroTagline: 'DOCUMENTO ESTRATÉGICO DE ARQUITECTURA & VALOR COMERCIAL',
  heroTitle: 'La Plataforma Tecnológica a Medida que Convierte a Royalty en el Líder Absoluto de Costa Rica',
  heroSubtitle: 'Diseñada exclusivamente para David Rojas: automatiza la captación de clientes, erradica cotizaciones informales en mensajes de texto, rastrea cuándo tu cliente abre y descarga tus propuestas, y convierte visitas en citas técnicas pagadas.',
  metrics: DEFAULT_METRICS,
  features: DEFAULT_FEATURES,
  closingTitle: '¿Por qué este sistema no es un gasto, sino el activo más rentable de Royalty?',
  closingText: 'Una página web genérica de $100 es solo un folleto digital que nadie lee. Esta plataforma es una máquina de operaciones y ventas construida a la medida de los procesos técnicos de David Rojas. Cada funcionalidad está programada para ahorrar horas de trabajo manual, proyectar máxima seriedad corporativa y asegurar que cada cliente que busque un destaqueo o detección en Costa Rica termine contratando a Royalty.',
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
              <span>Ver las 10 Funcionalidades en Detalle</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              href="/cotizador"
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Abrir Cotizador en Vivo</span>
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

                {/* Grid Explicativo en 3 Pasos: Dolor -> Solución -> Impacto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* 1. El Problema Tradicional */}
                  <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-2xl space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>El Dolor del Negocio Común</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {feat.problem}
                    </p>
                  </div>

                  {/* 2. La Solución en Este Sistema */}
                  <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-2xl space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>La Solución Implementada</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {feat.solution}
                    </p>
                  </div>

                  {/* 3. El Impacto Financiero / Operativo */}
                  <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-2xl space-y-1.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>El Impacto para David Rojas</span>
                    </div>
                    <p className="text-emerald-100/90 leading-relaxed font-semibold">
                      {feat.impact}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </section>

        {/* ========================================================
            CIERRE PERSUASIVO FINAL PARA EL DUEÑO DEL NEGOCIO
           ======================================================== */}
        <section className="bg-gradient-to-br from-[#67141d]/30 via-slate-900 to-[#0A192F] border-2 border-[#67141d]/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30 text-[10.5px] font-black uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Retorno Real Sobre la Inversión</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                {data.closingTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {data.closingText}
              </p>
              
              <blockquote className="border-l-2 border-amber-400 pl-3 py-1 text-xs italic text-amber-200/90 font-medium">
                "{data.closingQuote}"
              </blockquote>
            </div>

            <div className="shrink-0 flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
              <img src={LOGO_DESTAQUEO} alt="Royalty" className="w-36 sm:w-44 object-contain drop-shadow-md" />
              <button
                type="button"
                onClick={onNavigateAgenda}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-xs sm:text-sm shadow-xl transition-all active:scale-95 cursor-pointer text-center"
              >
                Experimentar el Flujo de Reserva
              </button>
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
                <label className="block text-[10.5px] font-bold text-red-400 uppercase mb-1">
                  El Dolor / Problema Tradicional
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
                  La Solución en Este Sistema
                </label>
                <textarea
                  rows={3}
                  value={editingFeature.solution}
                  onChange={(e) => setEditingFeature({ ...editingFeature, solution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-emerald-400 uppercase mb-1">
                  El Impacto para David Rojas
                </label>
                <textarea
                  rows={3}
                  value={editingFeature.impact}
                  onChange={(e) => setEditingFeature({ ...editingFeature, impact: e.target.value })}
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
