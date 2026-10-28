import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (pin: string) => Promise<boolean>;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLogin,
  onClose,
  isLoading,
  error
}) => {
  const [pin, setPin] = useState('');

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        onLogin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-brand-dark hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-brand-ice text-brand-blue flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <div className="w-9" /> {/* Spacer */}
        </div>

        <h3 className="text-xl font-extrabold text-brand-dark mb-1">
          Panel de Administrador
        </h3>
        <p className="text-xs text-brand-slate mb-6">
          Ingresa el PIN de seguridad de 4 dígitos (Demo: 1234)
        </p>

        {/* Display de PIN */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                pin.length > idx
                  ? 'border-brand-blue bg-brand-ice text-brand-blue shadow-sm'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              {pin.length > idx ? '●' : ''}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Teclado Numérico */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
            <button
              key={k}
              type="button"
              disabled={isLoading}
              onClick={() => {
                if (k === 'C') setPin('');
                else if (k === '⌫') handleBackspace();
                else handleKeyPress(k);
              }}
              className="h-13 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-brand-blue active:text-white text-base font-extrabold text-brand-dark border border-slate-200 shadow-sm transition-all"
            >
              {k}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand-blue">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verificando PIN...</span>
          </div>
        )}
      </div>
    </div>
  );
};
