import React, { useState } from 'react';
import { Camera, Upload, Trash2, ArrowLeft, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { CompressedImage, compressImageToWebP } from '../../../utils/imageCompressor';

interface StepPhotoUploadProps {
  photos: CompressedImage[];
  onAddPhoto: (photo: CompressedImage) => void;
  onRemovePhoto: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const StepPhotoUpload: React.FC<StepPhotoUploadProps> = ({
  photos,
  onAddPhoto,
  onRemovePhoto,
  onBack,
  onSubmit,
  isSubmitting
}) => {
  const [compressing, setCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length >= 3) {
      alert('Máximo 3 fotografías permitidas.');
      return;
    }

    setCompressing(true);
    try {
      const remainingSlots = 3 - photos.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        const compressed = await compressImageToWebP(file, 1200, 1200, 0.8);
        onAddPhoto(compressed);
      }
    } catch (err) {
      console.warn('Error al procesar y comprimir imagen:', err);
    } finally {
      setCompressing(false);
      e.target.value = ''; // Limpiar input para permitir re-selección
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-brand-ice p-4 rounded-2xl border border-brand-iceBorder">
        <div className="flex items-center gap-2 text-brand-blue font-extrabold text-sm mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Evidencia Fotográfica Opcional (Máx. 3 fotos)</span>
        </div>
        <p className="text-xs text-brand-slate">
          Sube fotos del medidor, mancha de humedad o área afectada. Las fotos se comprimen en tu dispositivo en formato WebP para cuidar tus datos.
        </p>
      </div>

      {/* Zona de Carga / Drag & Drop */}
      {photos.length < 3 && (
        <label className="border-2 border-dashed border-slate-300 hover:border-brand-blue rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-slate-50 transition-all">
          <input
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
            disabled={compressing || isSubmitting}
          />
          {compressing ? (
            <div className="flex flex-col items-center py-4 text-brand-blue gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">Comprimiendo a WebP ligero...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-ice text-brand-blue flex items-center justify-center mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-sm font-extrabold text-brand-dark">
                Tomar foto con la cámara o seleccionar
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Hasta 3 fotos ({photos.length}/3 subidas)
              </p>
            </div>
          )}
        </label>
      )}

      {/* Lista de Fotos Subidas con Ahorro */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {photos.map((p, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-2 shadow-sm">
              <img
                src={p.dataUrl}
                alt={p.name}
                className="w-full h-32 object-cover rounded-xl"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-emerald-600">
                  {p.compressedSizeKB} KB (WebP)
                </span>
                <button
                  type="button"
                  onClick={() => onRemovePhoto(idx)}
                  className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Acciones de Navegación */}
      <div className="pt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-3 rounded-xl font-bold text-brand-slate hover:bg-slate-100 transition-all flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atrás</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting || compressing}
          onClick={onSubmit}
          className="px-8 py-3.5 rounded-xl font-extrabold text-white bg-brand-orange hover:bg-brand-orangeHover shadow-glow-orange hover:shadow-xl disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Agendando Inspección...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Confirmar y Agendar Inspección</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
