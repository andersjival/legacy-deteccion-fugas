import React from 'react';

interface AnimatedEagleLogoProps {
  className?: string;
  imgClassName?: string;
}

export const AnimatedEagleLogo: React.FC<AnimatedEagleLogoProps> = ({
  className = 'w-12 h-12 rounded-2xl',
  imgClassName = ''
}) => {
  return (
    <div
      className={`relative bg-gradient-to-br from-white via-slate-50 to-sky-50 p-1 flex items-center justify-center overflow-hidden border border-cyan-400/60 shadow-soft animate-eagle-border group select-none ${className}`}
      title="Royality Detección de Fugas"
    >
      {/* Haz de luz animado que pasa por el águila periódicamente */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-200/40 via-white/80 to-transparent animate-eagle-sheen z-10" />

      {/* Águila oficial con resplandor y cambio de color sutil */}
      <img
        src="/logo.png"
        alt="Logo Águila Royality Detección de Fugas"
        className={`w-full h-full object-contain relative z-0 transition-transform duration-500 group-hover:scale-110 animate-eagle-glow ${imgClassName}`}
      />
    </div>
  );
};
