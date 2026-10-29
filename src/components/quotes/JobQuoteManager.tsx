import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  RefreshCw, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Briefcase,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Percent,
  Sparkles,
  MessageSquare,
  Download,
  FolderDown,
  FolderOpen,
  X,
  FileCheck
} from 'lucide-react';
import { JobQuote, QuoteItem, SavedQuoteEntry } from '../../types/quote';
import { getTodayDateString } from '../../utils/dateFormatter';

const STORAGE_KEY = 'royalty_saved_job_quote';
const HISTORY_STORAGE_KEY = 'royalty_saved_quotes_history';
const DEFAULT_LOGO = '/images/logo-royalty-destaqueo.png';
const CONTACT_BANNER = '/images/royalty-contacto-banner.png';

export const JobQuoteManager: React.FC = () => {
  const [activeMobileView, setActiveMobileView] = useState<'editor' | 'preview'>('editor');
  const [copied, setCopied] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generador de consecutivo inicial
  const generateQuoteNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(100 + Math.random() * 900);
    return `COT-${year}-${random}`;
  };

  const getInitialQuote = (): JobQuote => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...parsed,
            date: parsed.date || getTodayDateString()
          };
        }
      } catch (e) {
        // Fallback a nuevo
      }
    }

    return {
      id: `quote_${Date.now()}`,
      quoteNumber: generateQuoteNumber(),
      date: getTodayDateString(),
      companyName: 'Royalty Destaqueo de Tuberías',
      companyLogoUrl: DEFAULT_LOGO,
      customLogoUrl: null,
      clientName: '',
      clientLocation: '',
      clientPhone: '',
      workReference: 'Destaqueo de tubería e inspección técnica',
      scopeItems: [
        { id: '1', text: 'Inspección técnica preliminar del sistema de tuberías.' },
        { id: '2', text: 'Destaqueo y desobstrucción con equipo electromecánico de alta presión.' },
        { id: '3', text: 'Pruebas de evacuación y verificación de flujo continuo.' }
      ],
      laborCost: 45000,
      materialsCost: 15000,
      materialsDetail: 'Materiales básicos de ensamble, accesorios PVC y selladores herméticos.',
      applyIVA: false,
      ivaRate: 0.13,
      deliveryTime: '1 día hábil',
      paymentTerms: '100% contra entrega y satisfacción al cliente',
      checkpoints: {
        paymentOnDelivery: true,
        satisfactionGuarantee: true,
        certifiedMaterials: true,
        noHiddenCosts: true
      },
      responsibleName: 'David Rojas',
      responsibleTitle: 'Especialista en Destaqueos e Instalaciones',
      responsiblePhone: '6408-0124',
      instagramUrl: 'https://www.instagram.com/legacy.deteccion',
      whatsappUrl: 'https://wa.me/50664080124',
      emailContact: 'royaltydestaqueos@gmail.com',
      websiteUrl: 'https://legacydetec.pages.dev',
      createdAt: new Date().toISOString()
    };
  };

  const [quote, setQuote] = useState<JobQuote>(getInitialQuote);

  // Historial de cotizaciones guardadas en el sistema
  const [savedHistory, setSavedHistory] = useState<SavedQuoteEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const historyRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (historyRaw) return JSON.parse(historyRaw);
      } catch (e) {}
    }
    return [];
  });

  // Auto-guardado de borrador activo en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } catch (e) {}
  }, [quote]);

  // Cálculos financieros
  const labor = Number(quote.laborCost) || 0;
  const materials = Number(quote.materialsCost) || 0;
  const subtotal = labor + materials;
  const ivaAmount = quote.applyIVA ? Math.round(subtotal * (quote.ivaRate || 0.13)) : 0;
  const totalGeneral = subtotal + ivaAmount;

  // Manejador de subida de logo o foto del negocio
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('La imagen debe pesar menos de 3 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setQuote((prev) => ({ ...prev, customLogoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setQuote((prev) => ({ ...prev, customLogoUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Manejo de ítems de trabajo línea por línea
  const handleAddScopeItem = () => {
    const newItem: QuoteItem = {
      id: String(Date.now()),
      text: ''
    };
    setQuote((prev) => ({
      ...prev,
      scopeItems: [...prev.scopeItems, newItem]
    }));
  };

  const handleUpdateScopeItem = (id: string, text: string) => {
    setQuote((prev) => ({
      ...prev,
      scopeItems: prev.scopeItems.map((item) => (item.id === id ? { ...item, text } : item))
    }));
  };

  const handleRemoveScopeItem = (id: string) => {
    if (quote.scopeItems.length <= 1) return;
    setQuote((prev) => ({
      ...prev,
      scopeItems: prev.scopeItems.filter((item) => item.id !== id)
    }));
  };

  // Reiniciar cotización
  const handleResetQuote = () => {
    if (confirm('¿Desea crear una nueva cotización en blanco? Se restablecerán los campos.')) {
      const fresh: JobQuote = {
        ...getInitialQuote(),
        id: `quote_${Date.now()}`,
        quoteNumber: generateQuoteNumber(),
        date: getTodayDateString(),
        clientName: '',
        clientLocation: '',
        clientPhone: '',
        workReference: '',
        scopeItems: [
          { id: '1', text: '' }
        ],
        laborCost: 0,
        materialsCost: 0,
        materialsDetail: '',
        applyIVA: false
      };
      setQuote(fresh);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  // Generar texto para WhatsApp
  const generateWhatsAppMessage = () => {
    const itemsList = quote.scopeItems
      .filter((i) => i.text.trim())
      .map((i, idx) => `  ${idx + 1}. ${i.text}`)
      .join('\n');

    const msg = `📋 *COTIZACIÓN OFICIAL — ${quote.companyName.toUpperCase()}*
*N° de Control:* ${quote.quoteNumber}
*Fecha de Emisión:* ${quote.date}
*Cliente / Lugar:* ${quote.clientName || 'Cliente Particular'} ${quote.clientLocation ? `(${quote.clientLocation})` : ''}

🛠️ *Referencia del Trabajo:*
${quote.workReference || 'Trabajo Técnico Especializado'}

📝 *Alcance de Trabajos a Realizar:*
${itemsList || '  • Trabajos técnicos especializados de acuerdo a inspección.'}

💰 *Desglose Económico:*
• Mano de Obra: ₡${labor.toLocaleString('es-CR')}
• Estimado de Materiales: ₡${materials.toLocaleString('es-CR')}
• Subtotal: ₡${subtotal.toLocaleString('es-CR')}
${quote.applyIVA ? `• IVA (13% Factura Electrónica): ₡${ivaAmount.toLocaleString('es-CR')}\n` : ''}*TOTAL GENERAL:* ₡${totalGeneral.toLocaleString('es-CR')}

⏱️ *Tiempo Estimado de Entrega:* ${quote.deliveryTime}
✅ *Condiciones:* ${quote.paymentTerms}
🛡️ *Garantía:* 100% satisfacción y materiales certificados.

👤 *Atendido por:* ${quote.responsibleName} (${quote.responsibleTitle})
📞 *Teléfono:* ${quote.responsiblePhone}
📸 *Instagram:* https://www.instagram.com/legacy.deteccion
🌐 *Web:* ${quote.websiteUrl}

_Esta cotización fue generada de manera digital por el sistema de Royalty._`;

    return msg;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    const phone = quote.clientPhone ? quote.clientPhone.replace(/\D/g, '') : '';
    const url = phone.length >= 8 
      ? `https://wa.me/506${phone.slice(-8)}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateWhatsAppMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  // Abrir Modal de Guardar y Descargar con nombre sugerido
  const handleOpenDownloadModal = () => {
    const clientClean = quote.clientName.trim()
      ? quote.clientName.trim().replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '-')
      : 'Cliente';
    const suggested = `Cotizacion-${clientClean}-${quote.quoteNumber}`;
    setCustomFileName(suggested);
    setIsDownloadModalOpen(true);
  };

  // Guardar en el sistema (Historial persistente)
  const handleSaveToSystem = () => {
    const finalName = customFileName.trim() || `Cotizacion-${quote.quoteNumber}`;
    const entry: SavedQuoteEntry = {
      id: `quote_saved_${Date.now()}`,
      fileName: finalName,
      savedAt: new Date().toISOString(),
      totalAmount: totalGeneral,
      clientName: quote.clientName || 'Cliente Particular',
      workReference: quote.workReference || 'Trabajo Técnico',
      quoteData: { ...quote }
    };

    const updated = [entry, ...savedHistory.filter((item) => item.id !== entry.id)];
    setSavedHistory(updated);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    setSaveSuccessMessage(`✅ Guardado con éxito como "${finalName}" en el sistema.`);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  // Cargar cotización desde el historial
  const handleLoadFromHistory = (entry: SavedQuoteEntry) => {
    if (confirm(`¿Desea cargar la cotización "${entry.fileName}"? Reemplazará los campos actuales.`)) {
      setQuote(entry.quoteData);
      setIsHistoryOpen(false);
      setActiveMobileView('preview');
    }
  };

  // Eliminar del historial
  const handleDeleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta cotización del historial guardado?')) {
      const updated = savedHistory.filter((item) => item.id !== id);
      setSavedHistory(updated);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {}
    }
  };

  // Descarga limpia como PDF (Impresión dirigida exclusivamente a la hoja de cotización)
  const handlePrintOrDownloadPDF = (fileName?: string) => {
    const targetName = fileName || customFileName.trim() || `Cotizacion-${quote.quoteNumber}`;
    const previousTitle = document.title;
    document.title = targetName.replace(/\.pdf$/i, '');
    
    window.print();

    setTimeout(() => {
      document.title = previousTitle;
    }, 1500);
  };

  // Descarga directa como archivo HTML membretado sin conexión
  const handleDownloadHTML = () => {
    const finalName = customFileName.trim() || `Cotizacion-${quote.quoteNumber}`;
    const currentLogoUrl = quote.customLogoUrl || quote.companyLogoUrl || DEFAULT_LOGO;

    const itemsHTML = quote.scopeItems
      .filter((i) => i.text.trim())
      .map((i, idx) => `<tr><td style="padding: 6px 10px; font-weight: bold; width: 24px;">${idx + 1}.</td><td style="padding: 6px 10px;">${i.text}</td></tr>`)
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${finalName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 25px; color: #0f172a; background: #ffffff; }
    .sheet { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .top-bar { height: 6px; background: linear-gradient(90deg, #67141d, #8B1826, #0066CC); margin: -32px -32px 24px -32px; border-radius: 16px 16px 0 0; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; }
    .company { font-size: 20px; font-weight: 900; color: #67141d; margin: 0; }
    .badge { background: #67141d; color: white; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 900; display: inline-block; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin: 18px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #f1f5f9; padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .total-row { background: #fdf2f3; color: #67141d; font-weight: 900; font-size: 16px; }
    .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    @media print { body { padding: 0; } .sheet { border: none; box-shadow: none; padding: 10px; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="top-bar"></div>
    <div class="header">
      <div>
        <h1 class="company">${quote.companyName}</h1>
        <p style="margin: 3px 0; font-size: 12px; color: #64748b; font-weight: bold;">Especialistas en Tuberías & Detección Técnica</p>
        <p style="margin: 0; font-size: 12px; color: #64748b;">Costa Rica • Tel. ${quote.responsiblePhone}</p>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 900; font-family: monospace; font-size: 14px; color: #0f172a;">${quote.quoteNumber}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Fecha: <strong>${quote.date}</strong></div>
      </div>
    </div>

    <div class="box">
      <strong>Cotizado Para:</strong> ${quote.clientName || 'Cliente Particular'}<br>
      <strong>Lugar / Ubicación:</strong> ${quote.clientLocation || 'Área Metropolitana'}<br>
      ${quote.clientPhone ? `<strong>Teléfono:</strong> ${quote.clientPhone}<br>` : ''}
      <strong>Referencia:</strong> ${quote.workReference || 'Trabajo Técnico Especializado'}
    </div>

    <div style="margin: 18px 0;">
      <strong style="font-size: 12px; text-transform: uppercase; color: #475569;">Alcance de Trabajos a Realizar:</strong>
      <table>${itemsHTML}</table>
    </div>

    <div style="margin: 18px 0;">
      <strong style="font-size: 12px; text-transform: uppercase; color: #475569;">Desglose Económico:</strong>
      <table>
        <thead><tr><th>Concepto</th><th style="text-align: right;">Monto Estimado</th></tr></thead>
        <tbody>
          <tr><td>Mano de Obra Calificada</td><td style="text-align: right; font-weight: bold;">₡${labor.toLocaleString('es-CR')}</td></tr>
          <tr><td>Estimado de Materiales (${quote.materialsDetail || 'Insumos de instalación'})</td><td style="text-align: right; font-weight: bold;">₡${materials.toLocaleString('es-CR')}</td></tr>
          <tr style="background: #f8fafc;"><td>Subtotal:</td><td style="text-align: right; font-weight: bold;">₡${subtotal.toLocaleString('es-CR')}</td></tr>
          ${quote.applyIVA ? `<tr style="background: #f8fafc;"><td>IVA 13% (Factura Electrónica):</td><td style="text-align: right; font-weight: bold;">₡${ivaAmount.toLocaleString('es-CR')}</td></tr>` : ''}
          <tr class="total-row"><td>TOTAL GENERAL COTIZADO:</td><td style="text-align: right;">₡${totalGeneral.toLocaleString('es-CR')}</td></tr>
        </tbody>
      </table>
    </div>

    <div class="box" style="font-size: 12px;">
      <strong>Tiempo Estimado de Entrega:</strong> ${quote.deliveryTime}<br>
      <strong>Condiciones:</strong> ${quote.paymentTerms} (Materiales certificados y garantía técnica por escrito).
    </div>

    <div class="footer">
      <div>
        <div style="font-size: 16px; font-weight: bold; color: #67141d;">${quote.responsibleName}</div>
        <div style="font-size: 11px; color: #64748b;">${quote.responsibleTitle}</div>
        <div style="font-size: 12px; font-weight: bold; color: #0066CC;">Tel: ${quote.responsiblePhone}</div>
      </div>
      <div style="text-align: right; font-size: 11px; color: #64748b;">
        <div>Royalty Detección & Tuberías</div>
        <div>${quote.websiteUrl}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${finalName.endsWith('.html') ? finalName : finalName + '.html'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentLogo = quote.customLogoUrl || quote.companyLogoUrl || DEFAULT_LOGO;

  return (
    <div className="space-y-6">
      
      {/* Barra de Acciones y Switch de Vista Móvil */}
      <div className="no-print bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-brand-dark flex items-center gap-2">
              <span>Cotizador de Trabajos</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                Automático
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cree cotizaciones automáticas con desglose de mano de obra, materiales e IVA.
            </p>
          </div>
        </div>

        {/* Botones de Acción Rápida */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Switch Móvil */}
          <div className="flex md:hidden bg-slate-100 p-1 rounded-2xl text-xs font-black w-full justify-center mb-1">
            <button
              type="button"
              onClick={() => setActiveMobileView('editor')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeMobileView === 'editor' ? 'bg-white text-brand-dark shadow-xs' : 'text-slate-500'
              }`}
            >
              Editar Datos
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileView('preview')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeMobileView === 'preview' ? 'bg-white text-brand-dark shadow-xs' : 'text-slate-500'
              }`}
            >
              Ver Documento
            </button>
          </div>

          {/* Botón Principal: Guardar y Descargar con Nombre */}
          <button
            type="button"
            onClick={handleOpenDownloadModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Poner nombre, guardar en el sistema y descargar"
          >
            <Download className="w-4 h-4" />
            <span>Descargar / Guardar</span>
          </button>

          {/* Botón de Historial si existen cotizaciones guardadas */}
          {savedHistory.length > 0 && (
            <button
              type="button"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
              title="Ver cotizaciones guardadas en el sistema"
            >
              <FolderDown className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Guardadas</span>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {savedHistory.length}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Enviar cotización formateada por WhatsApp"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => handlePrintOrDownloadPDF()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Imprimir solo la hoja de cotización oficial"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
            title="Copiar texto de cotización"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetQuote}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Nueva cotización en blanco"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PANEL DESPLEGABLE DE HISTORIAL DE COTIZACIONES GUARDADAS */}
      {isHistoryOpen && (
        <div className="no-print bg-white p-5 rounded-3xl border border-indigo-200 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider">
                Cotizaciones Guardadas en el Sistema ({savedHistory.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto">
            {savedHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => handleLoadFromHistory(item)}
                className="bg-slate-50 hover:bg-indigo-50/50 p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer space-y-1 relative group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-brand-dark truncate pr-6">
                    {item.fileName}
                  </h4>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteFromHistory(item.id, e)}
                    className="text-slate-400 hover:text-red-500 p-1 absolute top-2 right-2 transition-colors"
                    title="Eliminar del historial"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 truncate font-semibold">
                  Cliente: <span className="text-brand-dark font-bold">{item.clientName}</span>
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {item.workReference}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                  <span className="font-mono text-slate-400">{item.savedAt.split('T')[0]}</span>
                  <span className="font-black text-emerald-800">₡{item.totalAmount.toLocaleString('es-CR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE GUARDAR Y DESCARGAR CON NOMBRE PERSONALIZADO */}
      {isDownloadModalOpen && (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-brand-dark">Guardar y Descargar Cotización</h3>
                  <p className="text-[11px] text-slate-500">Asigne un nombre para identificarla y descargarla</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-brand-dark uppercase tracking-wider">
                Nombre de la Cotización / Archivo:
              </label>
              <input
                type="text"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder="Ej. Cotizacion-Casa-Curridabat"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                autoFocus
              />
              <p className="text-[10px] text-slate-400">
                Este nombre se usará para el archivo guardado y descargado.
              </p>
            </div>

            {/* Opciones de Acción */}
            <div className="space-y-2 pt-1">
              {/* Botón 1: Guardar en el sistema */}
              <button
                type="button"
                onClick={handleSaveToSystem}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <FolderDown className="w-4 h-4" />
                <span>1. Guardar en el Sistema</span>
              </button>

              {/* Botón 2: Descargar PDF Oficial con ese nombre */}
              <button
                type="button"
                onClick={() => {
                  handleSaveToSystem();
                  handlePrintOrDownloadPDF(customFileName);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-brand-blue hover:bg-brand-blue/90 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>2. Descargar como PDF (Hoja Oficial)</span>
              </button>

              {/* Botón 3: Descargar Archivo HTML Independiente */}
              <button
                type="button"
                onClick={() => {
                  handleSaveToSystem();
                  handleDownloadHTML();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>3. Descargar Archivo HTML Membretado</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cuadrícula Principal: Formulario a la Izquierda / Hoja en Vivo a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            COLUMNA IZQUIERDA: FORMULARIO DE EDICIÓN ÁGIL
           ======================================================== */}
        <div className={`no-print lg:col-span-5 space-y-5 ${
          activeMobileView === 'preview' ? 'hidden lg:block' : 'block'
        }`}>
          
          {/* BLOQUE 1: Identidad, Logo y Consecutivo */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
            <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Briefcase className="w-4 h-4 text-brand-blue" />
              <span>1. Empresa y Logo de Cotización</span>
            </h3>

            {/* Logo oficial y subida de foto personalizada */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center p-1.5 overflow-hidden shadow-xs shrink-0">
                <img 
                  src={currentLogo} 
                  alt="Logo Cotización" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-[11px] font-bold text-slate-500 block truncate">
                  {quote.customLogoUrl ? 'Foto personalizada cargada' : 'Logo Oficial: Royalty Destaqueo'}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload-input"
                  />
                  <label
                    htmlFor="logo-upload-input"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-brand-blue bg-blue-50 border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Subir Foto / Logo</span>
                  </label>

                  {quote.customLogoUrl && (
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="text-xs text-red-500 hover:underline font-semibold"
                    >
                      Restablecer oficial
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={quote.companyName}
                  onChange={(e) => setQuote({ ...quote, companyName: e.target.value })}
                  placeholder="Royalty Destaqueos y Tuberías"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  N° Cotización (Consecutivo)
                </label>
                <input
                  type="text"
                  value={quote.quoteNumber}
                  onChange={(e) => setQuote({ ...quote, quoteNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Fecha de Emisión (Automática / Editable)
              </label>
              <input
                type="date"
                value={quote.date}
                onChange={(e) => setQuote({ ...quote, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>
          </div>

          {/* BLOQUE 2: Datos del Cliente y Lugar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-soft space-y-3">
            <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-brand-blue" />
              <span>2. Cliente y Lugar de Trabajo</span>
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Nombre del Cliente o Empresa
              </label>
              <input
                type="text"
                value={quote.clientName}
                onChange={(e) => setQuote({ ...quote, clientName: e.target.value })}
                placeholder="Ej: Lic. Mauricio Alvarado / Condominio Montesol"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Lugar / Dirección
                </label>
                <input
                  type="text"
                  value={quote.clientLocation}
                  onChange={(e) => setQuote({ ...quote, clientLocation: e.target.value })}
                  placeholder="Ej: Curridabat, San José"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="text"
                  value={quote.clientPhone}
                  onChange={(e) => setQuote({ ...quote, clientPhone: e.target.value })}
                  placeholder="Ej: 8888-0000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            </div>
          </div>

          {/* BLOQUE 3: Referencia y Alcance Línea por Línea */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-soft space-y-3">
            <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Briefcase className="w-4 h-4 text-brand-blue" />
              <span>3. Trabajo y Descripción Línea por Línea</span>
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Referencia del Trabajo
              </label>
              <input
                type="text"
                value={quote.workReference}
                onChange={(e) => setQuote({ ...quote, workReference: e.target.value })}
                placeholder="Ej: Instalación de tubería sanitaria y destaqueo de tramo principal"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Puntos a Realizar (Línea por Línea):
                </label>
                <button
                  type="button"
                  onClick={handleAddScopeItem}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue hover:text-brand-dark transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Punto</span>
                </button>
              </div>

              <div className="space-y-2">
                {quote.scopeItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-black text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleUpdateScopeItem(item.id, e.target.value)}
                      placeholder={`Punto ${idx + 1} del trabajo...`}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                    />
                    {quote.scopeItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveScopeItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar punto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BLOQUE 4: Desglose de Mano de Obra, Materiales e IVA */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
            <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>4. Desglose Económico</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Mano de Obra (₡)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₡</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={quote.laborCost || ''}
                    onChange={(e) => setQuote({ ...quote, laborCost: Number(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Estimado de Materiales (₡)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₡</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={quote.materialsCost || ''}
                    onChange={(e) => setQuote({ ...quote, materialsCost: Number(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Detalle / Lista de Materiales Estimados
              </label>
              <textarea
                rows={2}
                value={quote.materialsDetail}
                onChange={(e) => setQuote({ ...quote, materialsDetail: e.target.value })}
                placeholder="Ej: Tubería PVC 4 pulgadas, codos sanitarios, pegamento, cemento rápido..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/30 resize-none"
              />
            </div>

            {/* Checkbox IVA Factura Electrónica */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-brand-dark block">
                  ¿Aplica IVA para Factura Electrónica?
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Se añade 13% sobre el subtotal si el cliente lo requiere.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={quote.applyIVA}
                  onChange={(e) => setQuote({ ...quote, applyIVA: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Resumen Calculado */}
            <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/70 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Subtotal (Mano de obra + Materiales):</span>
                <span>₡{subtotal.toLocaleString('es-CR')}</span>
              </div>
              {quote.applyIVA && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>IVA 13%:</span>
                  <span>₡{ivaAmount.toLocaleString('es-CR')}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-950 font-black text-sm pt-1 border-t border-emerald-200">
                <span>Total General:</span>
                <span>₡{totalGeneral.toLocaleString('es-CR')}</span>
              </div>
            </div>
          </div>

          {/* BLOQUE 5: Tiempo de Entrega y Checkpoints */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
            <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-brand-blue" />
              <span>5. Tiempo de Entrega y Condiciones</span>
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                Tiempo Estimado de Ejecución / Entrega
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
                {['Mismo día', '1 día hábil', '2 días hábiles', '1 semana'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQuote({ ...quote, deliveryTime: opt })}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      quote.deliveryTime === opt
                        ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={quote.deliveryTime}
                onChange={(e) => setQuote({ ...quote, deliveryTime: e.target.value })}
                placeholder="Personalizar tiempo..."
                className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Checkpoints y Garantías Incluidas:
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={quote.checkpoints.paymentOnDelivery}
                    onChange={(e) => setQuote({
                      ...quote,
                      checkpoints: { ...quote.checkpoints, paymentOnDelivery: e.target.checked }
                    })}
                    className="rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <span>100% contra entrega y total satisfacción al cliente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={quote.checkpoints.certifiedMaterials}
                    onChange={(e) => setQuote({
                      ...quote,
                      checkpoints: { ...quote.checkpoints, certifiedMaterials: e.target.checked }
                    })}
                    className="rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <span>Materiales certificados y de primera calidad constructiva</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={quote.checkpoints.satisfactionGuarantee}
                    onChange={(e) => setQuote({
                      ...quote,
                      checkpoints: { ...quote.checkpoints, satisfactionGuarantee: e.target.checked }
                    })}
                    className="rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <span>Garantía técnica por escrito en mano de obra</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={quote.checkpoints.noHiddenCosts}
                    onChange={(e) => setQuote({
                      ...quote,
                      checkpoints: { ...quote.checkpoints, noHiddenCosts: e.target.checked }
                    })}
                    className="rounded text-brand-blue focus:ring-brand-blue"
                  />
                  <span>Sin cobros ocultos ni sobrecostos imprevistos</span>
                </label>
              </div>
            </div>
          </div>

          {/* BLOQUE 6: Firma del Responsable */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-soft space-y-3">
            <h3 className="text-xs font-black text-brand-dark uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-brand-blue" />
              <span>6. Datos del Responsable que Firma</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Nombre del Especialista
                </label>
                <input
                  type="text"
                  value={quote.responsibleName}
                  onChange={(e) => setQuote({ ...quote, responsibleName: e.target.value })}
                  placeholder="David Rojas"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={quote.responsiblePhone}
                  onChange={(e) => setQuote({ ...quote, responsiblePhone: e.target.value })}
                  placeholder="6408-0124"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================
            COLUMNA DERECHA: DOCUMENTO OFICIAL EN VIVO (PREVIEW / PRINT)
           ======================================================== */}
        <div className={`lg:col-span-7 ${
          activeMobileView === 'editor' ? 'hidden lg:block' : 'block'
        }`}>
          
          {/* Contenedor Imprimible Oficial (Hoja Membretada) con ID único para aislamiento en impresión */}
          <div 
            id="printable-quote-sheet"
            className="print-area bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6 text-brand-dark font-sans relative overflow-hidden"
          >
            
            {/* Barra Decorativa Superior */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#67141d] via-[#8B1826] to-[#0066CC]" />

            {/* ENCABEZADO OFICIAL DE LA COTIZACIÓN */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 pt-2">
              
              {/* Logo y Nombre Comercial */}
              <div className="flex items-center gap-3">
                <div className="w-24 sm:w-28 h-16 sm:h-20 flex items-center justify-center shrink-0">
                  <img 
                    src={currentLogo} 
                    alt="Logo Empresa" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-[#67141d] leading-tight">
                    {quote.companyName}
                  </h1>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Especialistas en Tuberías & Detección Técnica
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Costa Rica • Tel. {quote.responsiblePhone}
                  </p>
                </div>
              </div>

              {/* Consecutivo y Fecha */}
              <div className="bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none w-full sm:w-auto text-left sm:text-right border sm:border-0 border-slate-100">
                <div className="text-sm font-mono font-black text-brand-dark">
                  {quote.quoteNumber}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">
                  Fecha: <span className="text-brand-dark font-extrabold">{quote.date}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  Validez: 15 días naturales
                </div>
              </div>
            </div>

            {/* DATOS DEL CLIENTE Y LUGAR */}
            <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Cotizado Para:
                </span>
                <span className="text-sm font-black text-brand-dark block mt-0.5">
                  {quote.clientName || 'Cliente Particular'}
                </span>
                {quote.clientPhone && (
                  <span className="text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-brand-blue" />
                    <span>{quote.clientPhone}</span>
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Lugar / Ubicación del Trabajo:
                </span>
                <span className="text-xs font-extrabold text-slate-700 block mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                  <span>{quote.clientLocation || 'Área Metropolitana / A convenir'}</span>
                </span>
              </div>
            </div>

            {/* REFERENCIA PRINCIPAL */}
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Referencia del Proyecto / Trabajo:
              </span>
              <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100 font-extrabold text-brand-dark text-xs sm:text-sm">
                {quote.workReference || 'Trabajos Técnicos Especializados de Destaqueo y Fontanería'}
              </div>
            </div>

            {/* DESCRIPCIÓN DE ALCANCE LÍNEA POR LÍNEA */}
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Alcance y Puntos de Trabajo a Realizar:
              </span>
              <div className="space-y-2">
                {quote.scopeItems
                  .filter((item) => item.text.trim())
                  .map((item, idx) => (
                    <div key={item.id} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-md bg-[#67141d]/10 text-[#67141d] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed font-semibold">{item.text}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* TABLA FORMAL DE DESGLOSE ECONÓMICO */}
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Desglose Económico de la Propuesta:
              </span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100/80 text-slate-600 font-black uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 text-left">Concepto</th>
                      <th className="py-2.5 px-4 text-right">Monto Estimado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    <tr>
                      <td className="py-2.5 px-4 font-bold">Mano de Obra Calificada y Ejecución Técnica</td>
                      <td className="py-2.5 px-4 text-right font-extrabold text-brand-dark">
                        ₡{labor.toLocaleString('es-CR')}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">
                        <div className="font-bold">Estimado de Materiales e Insumos</div>
                        {quote.materialsDetail && (
                          <div className="text-[10px] text-slate-400 italic mt-0.5">
                            {quote.materialsDetail}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right font-extrabold text-brand-dark">
                        ₡{materials.toLocaleString('es-CR')}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/60 font-bold">
                      <td className="py-2 px-4 text-slate-600">Subtotal de la Obra:</td>
                      <td className="py-2 px-4 text-right font-black text-brand-dark">
                        ₡{subtotal.toLocaleString('es-CR')}
                      </td>
                    </tr>
                    {quote.applyIVA && (
                      <tr className="bg-slate-50/60 font-bold text-slate-600">
                        <td className="py-2 px-4">IVA (13% - Factura Electrónica):</td>
                        <td className="py-2 px-4 text-right font-black text-emerald-800">
                          ₡{ivaAmount.toLocaleString('es-CR')}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-[#67141d]/5 font-black text-sm text-[#67141d]">
                      <td className="py-3 px-4">TOTAL GENERAL COTIZADO:</td>
                      <td className="py-3 px-4 text-right text-base font-black">
                        ₡{totalGeneral.toLocaleString('es-CR')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TIEMPO DE ENTREGA Y CHECKPOINTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              
              {/* Tiempo de Entrega */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Tiempo Estimado de Entrega:
                </span>
                <div className="font-black text-brand-dark text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-blue" />
                  <span>{quote.deliveryTime || '1 día hábil'}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Sujeto a confirmación tras inicio de labores.
                </p>
              </div>

              {/* Checkpoints de Calidad */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  Condiciones y Compromisos:
                </span>
                <div className="space-y-1 text-[11px] font-bold text-slate-700">
                  {quote.checkpoints.paymentOnDelivery && (
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Pago 100% contra entrega y satisfacción</span>
                    </div>
                  )}
                  {quote.checkpoints.certifiedMaterials && (
                    <div className="flex items-center gap-1.5 text-brand-dark">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-brand-blue" />
                      <span>Materiales certificados y duraderos</span>
                    </div>
                  )}
                  {quote.checkpoints.satisfactionGuarantee && (
                    <div className="flex items-center gap-1.5 text-brand-dark">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-brand-blue" />
                      <span>Garantía técnica por escrito en mano de obra</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FIRMA Y DATOS DE DAVID ROJAS + CONTACTO BANNER */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Firma */}
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-script text-lg sm:text-xl text-[#67141d] font-bold tracking-wider">
                  {quote.responsibleName}
                </div>
                <div className="h-0.5 w-36 bg-slate-300 mx-auto sm:mx-0 my-1" />
                <h4 className="text-xs font-black text-brand-dark">{quote.responsibleName}</h4>
                <p className="text-[10px] font-bold text-slate-400">{quote.responsibleTitle}</p>
                <p className="text-[11px] font-black text-brand-blue">Tel: {quote.responsiblePhone}</p>
              </div>

              {/* Banner Oficial de Redes Sociales Subido por el Cliente */}
              <div className="text-center sm:text-right space-y-2">
                <div className="inline-block bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                  <img 
                    src={CONTACT_BANNER} 
                    alt="Royalty Contacto" 
                    className="h-10 sm:h-12 object-contain mx-auto"
                  />
                </div>
                <div className="text-[10px] font-bold text-slate-500">
                  <a href={quote.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-blue">
                    {quote.websiteUrl}
                  </a>
                </div>
              </div>
            </div>

            {/* Pie Legal Mínimo */}
            <div className="pt-4 border-t border-slate-100 text-[9px] text-slate-400 text-center flex flex-col sm:flex-row items-center justify-between gap-1">
              <span>Documento emitido electrónicamente con plena validez comercial.</span>
              <span>Royalty Detección & Tuberías • David Rojas</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
