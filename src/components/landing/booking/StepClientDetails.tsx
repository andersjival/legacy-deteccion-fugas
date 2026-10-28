import React from 'react';
import { User, Phone, MapPin, Wrench, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
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
  const isPhoneValid = formData.client_phone.replace(/\D/g, '').length >= 8;
  const isAddressValid = formData.client_address.trim().length >= 5 || (formData.latitude !== null && formData.longitude !== null);
  const isFormValid =
    formData.client_name.trim().length >= 3 &&
    isPhoneValid &&
    isAddressValid &&
    formData.problem_description.trim().length >= 10;

  const handleLocationPicked = (lat: number, lng: number) => {
    onChangeLocation(lat, lng);
    // Si la dirección escrita está vacía o es muy corta, sugerir texto de apoyo
    if (!formData.client_address || formData.client_address.trim().length < 5) {
      onChange('client_address', `Ubicación fijada en mapa GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre Completo */}
        <div>
          <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
            Nombre y Apellidos *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="Ej. Carlos Montero"
              value={formData.client_name}
              onChange={(e) => onChange('client_name', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
            Teléfono Móvil (WhatsApp) *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              required
              placeholder="Ej. 6408-0124 o 8888-8888"
              value={formData.client_phone}
              onChange={(e) => onChange('client_phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            />
          </div>
          {!isPhoneValid && formData.client_phone.length > 0 && (
            <p className="text-[11px] text-red-500 mt-1">Mínimo 8 dígitos de teléfono.</p>
          )}
        </div>
      </div>

      {/* Tipo de Servicio */}
      <div>
        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
          Tipo de Servicio Requerido *
        </label>
        <div className="relative">
          <Wrench className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <select
            value={formData.service_type}
            onChange={(e) => onChange('service_type', e.target.value as ServiceType)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all appearance-none"
          >
            <option value="Detección Especializada de Fugas">Detección Especializada de Fugas (Acústica / FLIR)</option>
            <option value="Rastreo y Diagnóstico de Tuberías">Rastreo y Diagnóstico de Tuberías (Trazador)</option>
            <option value="Limpieza Técnica de Tuberías">Limpieza Técnica de Tuberías (Desincrustación)</option>
          </select>
        </div>
      </div>

      {/* Dirección Escrita + Mapa Interactivo */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
            Dirección Exacta o Cantón / Distrito (Escríbela o márcala en el mapa) *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="Ej. San José, Escazú, 200m este del parque o Condominio Los Reyes casa 4"
              value={formData.client_address}
              onChange={(e) => onChange('client_address', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Mapa Interactivo con Pin y GPS */}
        <LocationPickerMap
          latitude={formData.latitude}
          longitude={formData.longitude}
          onChangeLocation={handleLocationPicked}
        />
      </div>

      {/* Descripción Detallada del Problema */}
      <div>
        <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
          Descripción del Problema o Síntomas *
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <textarea
            required
            rows={3}
            placeholder="Ej. Subió el recibo de agua al doble, se escucha sonido constante en el baño principal, hay mancha de humedad en la pared colindante..."
            value={formData.problem_description}
            onChange={(e) => onChange('problem_description', e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Botones de Navegación */}
      <div className="pt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl font-bold text-brand-slate hover:bg-slate-100 transition-all flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atrás</span>
        </button>

        <button
          type="button"
          disabled={!isFormValid}
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl font-extrabold text-white bg-brand-blue hover:bg-brand-lightBlue disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md transition-all flex items-center gap-2 text-sm"
        >
          <span>Subir Fotos (Evidencia)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
