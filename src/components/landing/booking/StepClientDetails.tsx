import React from 'react';
import { User, Phone, MapPin, Wrench, FileText, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceType } from '../../../types/appointment';
import { LocationPickerMap } from '../../common/LocationPickerMap';

interface StepClientDetailsProps {
  formData: {
    client_name: string;
    client_phone: string;
    client_address: string;
    latitude: number | null;
    longitude: number | null;
    service_type: ServiceType;
    problem_description: string;
  };
  onChange: (field: string, value: string) => void;
  onChangeLocation: (lat: number, lng: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export const StepClientDetails: React.FC<StepClientDetailsProps> = ({
  formData,
  onChange,
  onChangeLocation,
  onBack,
  onNext
}) => {
  const isNameValid = formData.client_name.trim().length >= 3;
  const isPhoneValid = formData.client_phone.replace(/\D/g, '').length >= 8;
  const isAddressWritten = formData.client_address.trim().length >= 5;
  const isLocationPinned = formData.latitude !== null && formData.longitude !== null;
  const isAddressValid = isAddressWritten || isLocationPinned;
  const isProblemValid = formData.problem_description.trim().length >= 10;

  const isFormValid = isNameValid && isPhoneValid && isAddressValid && isProblemValid;

  const handleLocationPicked = (lat: number, lng: number) => {
    onChangeLocation(lat, lng);
    if (!formData.client_address || formData.client_address.trim().length < 5) {
      onChange('client_address', `Ubicación fijada en mapa GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Nombre Completo */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Nombre y Apellidos *
            </label>
            {isNameValid && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Listo
              </span>
            )}
          </div>
          <div className="relative">
            <User className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${isNameValid ? 'text-emerald-500' : 'text-slate-400'}`} />
            <input
              type="text"
              required
              placeholder="Ej. Carlos Montero"
              value={formData.client_name}
              onChange={(e) => onChange('client_name', e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                isNameValid
                  ? 'border-emerald-500 bg-emerald-50/20 text-brand-dark focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
              }`}
            />
            {isNameValid && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
            )}
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Teléfono Móvil (WhatsApp) *
            </label>
            {isPhoneValid && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Listo
              </span>
            )}
          </div>
          <div className="relative">
            <Phone className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${isPhoneValid ? 'text-emerald-500' : 'text-slate-400'}`} />
            <input
              type="tel"
              required
              placeholder="Ej. 6408-0124 o 8888-8888"
              value={formData.client_phone}
              onChange={(e) => onChange('client_phone', e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                isPhoneValid
                  ? 'border-emerald-500 bg-emerald-50/20 text-brand-dark focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
              }`}
            />
            {isPhoneValid && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
            )}
          </div>
          {!isPhoneValid && formData.client_phone.length > 0 && (
            <p className="text-[10px] text-red-500 mt-0.5">Mínimo 8 dígitos de teléfono.</p>
          )}
        </div>
      </div>

      {/* Tipo de Servicio */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
            Tipo de Servicio Requerido *
          </label>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Listo
          </span>
        </div>
        <div className="relative">
          <Wrench className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3.5" />
          <select
            value={formData.service_type}
            onChange={(e) => onChange('service_type', e.target.value as ServiceType)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-emerald-500 bg-emerald-50/20 text-sm font-semibold text-brand-dark focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all appearance-none"
          >
            <option value="Detección Especializada de Fugas">Detección Especializada de Fugas (Acústica / FLIR)</option>
            <option value="Rastreo y Diagnóstico de Tuberías">Rastreo y Diagnóstico de Tuberías (Trazador)</option>
            <option value="Limpieza Técnica de Tuberías">Limpieza Técnica de Tuberías (Desincrustación)</option>
          </select>
        </div>
      </div>

      {/* Dirección Escrita + Mapa Interactivo */}
      <div className="space-y-2.5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
              Dirección Exacta o Cantón *
            </label>
            {isAddressWritten && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Listo
              </span>
            )}
          </div>
          <div className="relative">
            <MapPin className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${isAddressWritten ? 'text-emerald-500' : 'text-slate-400'}`} />
            <input
              type="text"
              required
              placeholder="Ej. San José, Escazú, 200m este del parque o Condominio Los Reyes"
              value={formData.client_address}
              onChange={(e) => onChange('client_address', e.target.value)}
              className={`w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                isAddressWritten
                  ? 'border-emerald-500 bg-emerald-50/20 text-brand-dark focus:ring-2 focus:ring-emerald-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
              }`}
            />
            {isAddressWritten && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
            )}
          </div>
        </div>

        {/* Mapa Interactivo con Pin y GPS */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Punto de Llegada en Mapa GPS / Waze
            </span>
            {isLocationPinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                GPS Fijado
              </span>
            )}
          </div>
          <LocationPickerMap
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChangeLocation={handleLocationPicked}
          />
        </div>
      </div>

      {/* Descripción Detallada del Problema */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-brand-dark uppercase tracking-wider">
            Descripción del Problema o Síntomas *
          </label>
          {isProblemValid && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Listo
            </span>
          )}
        </div>
        <div className="relative">
          <FileText className={`w-4 h-4 absolute left-3.5 top-3.5 transition-colors ${isProblemValid ? 'text-emerald-500' : 'text-slate-400'}`} />
          <textarea
            required
            rows={2}
            placeholder="Ej. Subió el recibo de agua al doble, se escucha sonido constante en el baño..."
            value={formData.problem_description}
            onChange={(e) => onChange('problem_description', e.target.value)}
            className={`w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
              isProblemValid
                ? 'border-emerald-500 bg-emerald-50/20 text-brand-dark focus:ring-2 focus:ring-emerald-500/20'
                : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
            }`}
          />
          {isProblemValid && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5" />
          )}
        </div>
        {!isProblemValid && formData.problem_description.length > 0 && (
          <p className="text-[10px] text-slate-400 mt-0.5">Escribe al menos 10 caracteres para orientar al técnico.</p>
        )}
      </div>

      {/* Botones de Navegación */}
      <div className="pt-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl font-bold text-brand-slate hover:bg-slate-100 transition-all flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atrás</span>
        </button>

        <button
          type="button"
          disabled={!isFormValid}
          onClick={onNext}
          className="px-6 sm:px-8 py-3 rounded-xl font-extrabold text-white bg-brand-blue hover:bg-brand-lightBlue disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-2 text-xs sm:text-sm"
        >
          <span>Siguiente: Fotos de Evidencia</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
