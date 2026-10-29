import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { api } from '../../services/api';

const DEFAULT_LOGO = '/images/logo-royalty-destaqueo.png';
const CONTACT_BANNER = '/images/royalty-contacto-banner.png';

interface ClientQuoteViewProps {
  quoteId: string;
  onBackToHome?: () => void;
}

export const ClientQuoteView: React.FC<ClientQuoteViewProps> = ({
  quoteId,
  onBackToHome
}) => {
  const [quote, setQuote] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getQuoteById(quoteId)
      .then((data) => {
        if (isMounted) {
          setQuote(data);
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [quoteId]);

  const handleClientDownload = async () => {
    if (!quote) return;
    
    // 1. Notificar al backend D1 que el cliente descargó la cotización
    try {
      await api.markQuoteDownloaded(quote.id || quoteId);
    } catch (e) {}

    // 2. Preparar el título del documento para la descarga limpia en PDF
    const targetName = quote.file_name || `Cotizacion-${quote.quote_number || 'Royalty'}`;
    const previousTitle = document.title;
    document.title = targetName.replace(/\.pdf$/i, '');

    // 3. Ejecutar diálogo de impresión / Guardar como PDF
    window.print();

    setDownloadSuccess(true);
    setTimeout(() => {
      document.title = previousTitle;
    }, 1500);
  };

  const handleContactWhatsApp = () => {
    if (!quote) return;
    const msg = encodeURIComponent(
      `Hola David, he revisado la cotización ${quote.quote_number || ''} para ${quote.client_name || 'mi propiedad'} (Monto: ₡${Number(quote.total_amount || 0).toLocaleString('es-CR')}). Deseo coordinar el inicio del trabajo.`
    );
    window.open(`https://wa.me/50664080124?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin mb-3" />
        <p className="text-sm font-extrabold text-brand-dark">Cargando cotización oficial...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-brand-dark">Cotización no encontrada</h3>
          <p className="text-xs text-slate-500 font-medium">
            El enlace de cotización puede haber expirado o no estar disponible temporalmente.
          </p>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-brand-blue text-xs shadow-sm hover:bg-brand-blue/90"
            >
              Volver a la Página Principal
            </button>
          )}
        </div>
      </div>
    );
  }

  // Parsear items de trabajo si vienen como string JSON de D1
  const scopeItems: Array<{ id: string; text: string }> = Array.isArray(quote.scope_items)
    ? quote.scope_items
    : typeof quote.scope_items === 'string'
    ? (() => {
        try { return JSON.parse(quote.scope_items); } catch { return []; }
      })()
    : Array.isArray(quote.scopeItems)
    ? quote.scopeItems
    : [];

  const labor = Number(quote.labor_cost ?? quote.laborCost ?? 0);
  const materials = Number(quote.materials_cost ?? quote.materialsCost ?? 0);
  const subtotal = labor + materials;
  const applyIVA = Boolean(quote.apply_iva ?? quote.applyIVA);
  const ivaAmount = applyIVA ? Math.round(subtotal * 0.13) : 0;
  const totalGeneral = Number(quote.total_amount ?? quote.totalAmount ?? (subtotal + ivaAmount));

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-brand-dark font-sans select-none">
      
      {/* Barra Superior para el Cliente (no visible en impresión) */}
      <div className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                title="Volver al inicio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-brand-dark">Cotización en Línea</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verificada Oficial</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">
                Emitida por Royalty Destaqueo & Tuberías para {quote.client_name || quote.clientName || 'Cliente'}
              </p>
            </div>
          </div>

          {/* Botones de Acción para el Cliente */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleClientDownload}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-brand-blue hover:bg-brand-blue/90 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Cotización (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleContactWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Aceptar por WhatsApp</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="max-w-4xl mx-auto mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
            ✅ Documento descargado correctamente. El técnico ha sido notificado de su descarga.
          </div>
        )}
      </div>

      {/* Contenedor Central de la Hoja de Cotización Oficial */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        
        {/* Hoja Membretada con ID único para aislamiento en impresión */}
        <div 
          id="printable-quote-sheet"
          className="print-area bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-6 text-brand-dark font-sans relative overflow-hidden"
        >
          {/* Barra Decorativa Superior */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#67141d] via-[#8B1826] to-[#0066CC]" />

          {/* Encabezado Oficial */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-28 h-16 sm:h-20 flex items-center justify-center shrink-0">
                <img 
                  src={DEFAULT_LOGO} 
                  alt="Logo Royalty" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-[#67141d] leading-tight">
                  {quote.company_name || quote.companyName || 'Royalty Destaqueo de Tuberías'}
                </h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Especialistas en Tuberías & Detección Técnica
                </p>
                <p className="text-[11px] font-semibold text-slate-400">
                  Costa Rica • Tel. {quote.responsible_phone || quote.responsiblePhone || '6408-0124'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl sm:rounded-none w-full sm:w-auto text-left sm:text-right border sm:border-0 border-slate-100">
              <div className="text-sm font-mono font-black text-brand-dark">
                {quote.quote_number || quote.quoteNumber}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">
                Fecha: <span className="text-brand-dark font-extrabold">{quote.date}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold">
                Validez: 15 días naturales
              </div>
            </div>
          </div>

          {/* Datos del Cliente y Ubicación */}
          <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Cotizado Para:
              </span>
              <span className="text-sm font-black text-brand-dark block mt-0.5">
                {quote.client_name || quote.clientName || 'Cliente Particular'}
              </span>
              {(quote.client_phone || quote.clientPhone) && (
                <span className="text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-brand-blue" />
                  <span>{quote.client_phone || quote.clientPhone}</span>
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Lugar / Ubicación del Trabajo:
              </span>
              <span className="text-xs font-extrabold text-slate-700 block mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span>{quote.client_location || quote.clientLocation || 'Área Metropolitana / A convenir'}</span>
              </span>
            </div>
          </div>

          {/* Referencia Principal */}
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
              Referencia del Proyecto / Trabajo:
            </span>
            <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100 font-extrabold text-brand-dark text-xs sm:text-sm">
              {quote.work_reference || quote.workReference || 'Trabajos Técnicos Especializados de Destaqueo y Fontanería'}
            </div>
          </div>

          {/* Alcance Línea por Línea */}
          {scopeItems.length > 0 && (
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
                Alcance y Puntos de Trabajo a Realizar:
              </span>
              <div className="space-y-2">
                {scopeItems
                  .filter((item) => item.text && item.text.trim())
                  .map((item, idx) => (
                    <div key={item.id || idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-md bg-[#67141d]/10 text-[#67141d] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed font-semibold">{item.text}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tabla de Desglose Económico */}
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
                      {(quote.materials_detail || quote.materialsDetail) && (
                        <div className="text-[10px] text-slate-400 italic mt-0.5">
                          {quote.materials_detail || quote.materialsDetail}
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
                  {applyIVA && (
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

          {/* Tiempo de Entrega y Checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Tiempo Estimado de Entrega:
              </span>
              <div className="font-black text-brand-dark text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-blue" />
                <span>{quote.delivery_time || quote.deliveryTime || '1 día hábil'}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Sujeto a confirmación tras inicio de labores.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                Condiciones y Compromisos:
              </span>
              <div className="space-y-1 text-[11px] font-bold text-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Pago 100% contra entrega y satisfacción</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-dark">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-brand-blue" />
                  <span>Materiales certificados y duraderos</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-dark">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-brand-blue" />
                  <span>Garantía técnica por escrito en mano de obra</span>
                </div>
              </div>
            </div>
          </div>

          {/* Firma Oficial y Banner */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-script text-lg sm:text-xl text-[#67141d] font-bold tracking-wider">
                {quote.responsible_name || quote.responsibleName || 'David Rojas'}
              </div>
              <div className="h-0.5 w-36 bg-slate-300 mx-auto sm:mx-0 my-1" />
              <h4 className="text-xs font-black text-brand-dark">{quote.responsible_name || quote.responsibleName || 'David Rojas'}</h4>
              <p className="text-[10px] font-bold text-slate-400">Especialista en Destaqueos e Instalaciones</p>
              <p className="text-[11px] font-black text-brand-blue">Tel: {quote.responsible_phone || quote.responsiblePhone || '6408-0124'}</p>
            </div>

            <div className="text-center sm:text-right space-y-2">
              <div className="inline-block bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                <img 
                  src={CONTACT_BANNER} 
                  alt="Royalty Contacto" 
                  className="h-10 sm:h-12 object-contain mx-auto"
                />
              </div>
              <div className="text-[10px] font-bold text-slate-500">
                <span>https://legacydetec.pages.dev</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[9px] text-slate-400 text-center flex flex-col sm:flex-row items-center justify-between gap-1">
            <span>Documento emitido electrónicamente con plena validez comercial.</span>
            <span>Royalty Detección & Tuberías • David Rojas</span>
          </div>
        </div>

      </main>
    </div>
  );
};
