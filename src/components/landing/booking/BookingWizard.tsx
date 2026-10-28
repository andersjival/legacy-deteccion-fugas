import React, { useState } from 'react';
import { StepDateAndTime } from './StepDateAndTime';
import { StepClientDetails } from './StepClientDetails';
import { StepPhotoUpload } from './StepPhotoUpload';
import { StepConfirmation } from './StepConfirmation';
import { Appointment, ServiceType, TimeSlot } from '../../../types/appointment';
import { CompressedImage } from '../../../utils/imageCompressor';
import { api } from '../../../services/api';

interface BookingWizardProps {
  initialService?: ServiceType;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialService = 'Detección Especializada de Fugas'
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_address: '',
    service_type: initialService,
    problem_description: ''
  });

  const [photos, setPhotos] = useState<CompressedImage[]>([]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPhoto = (photo: CompressedImage) => {
    if (photos.length < 3) {
      setPhotos((prev) => [...prev, photo]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      const newApp = await api.createAppointment({
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        client_address: formData.client_address,
        service_type: formData.service_type,
        problem_description: formData.problem_description,
        appointment_date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        photos: photos.map((p) => ({ name: p.name, dataUrl: p.dataUrl }))
      });
      setConfirmedAppointment(newApp);
      setStep(4);
    } catch (err) {
      alert('Error al agendar la cita. Por favor intente nuevamente.');
      console.warn(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSlot(null);
    setFormData({
      client_name: '',
      client_phone: '',
      client_address: '',
      service_type: 'Detección Especializada de Fugas',
      problem_description: ''
    });
    setPhotos([]);
    setConfirmedAppointment(null);
  };

  return (
    <section id="agendar" className="py-20 bg-brand-ice/40 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera del Wizard */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs sm:text-sm font-bold text-brand-blue tracking-widest uppercase">
            Disponibilidad en Vivo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            AGENDA TU INSPECCIÓN TÉCNICA
          </h2>
          <p className="text-sm text-brand-slate max-w-xl mx-auto">
            Elige el horario conveniente y describe tu caso. Recibirás atención prioritaria y confirmación inmediata.
          </p>
        </div>

        {/* Tarjeta Principal del Formulario Interactivo */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-card">
          
          {/* Barra de Pasos */}
          {step < 4 && (
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 text-xs font-bold">
              {[
                { s: 1, label: 'Fecha y Rango Horario' },
                { s: 2, label: 'Tus Datos' },
                { s: 3, label: 'Evidencia' }
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      step >= item.s
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {item.s}
                  </div>
                  <span className={`hidden sm:inline ${step >= item.s ? 'text-brand-dark' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Renderizado de Pasos */}
          {step === 1 && (
            <StepDateAndTime
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSelectDate={setSelectedDate}
              onSelectSlot={setSelectedSlot}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepClientDetails
              formData={formData}
              onChange={handleFieldChange}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <StepPhotoUpload
              photos={photos}
              onAddPhoto={handleAddPhoto}
              onRemovePhoto={handleRemovePhoto}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 4 && confirmedAppointment && (
            <StepConfirmation
              appointment={confirmedAppointment}
              onReset={handleReset}
            />
          )}
        </div>

      </div>
    </section>
  );
};
