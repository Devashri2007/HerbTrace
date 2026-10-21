import React from 'react';

const HerbTraceLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg'
  variant = 'light', // 'light' (for white navbar) | 'dark' (for dark footer)
  showSubtitle = true,
  className = '',
}) => {
  const isDark = variant === 'dark';

  // Sizing definitions
  const iconDimensions =
    size === 'sm'
      ? 'w-9 h-9'
      : size === 'lg'
      ? 'w-14 h-14'
      : 'w-11 h-11';

  const titleSize =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : 'text-xl';

  const subtitleSize =
    size === 'sm'
      ? 'text-[9px]'
      : size === 'lg'
      ? 'text-[11px] sm:text-xs'
      : 'text-[9.5px] sm:text-[10px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Botanical Ayurvedic + Blockchain Logo Emblem Picture */}
      <div className={`relative ${iconDimensions} shrink-0 group-hover:scale-105 transition-transform duration-200`}>
        <img
          src="/herbtrace-logo.svg"
          alt="HerbTrace Botanical Logo"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* Brand Name & Requested Subtitle */}
      <div className="flex flex-col justify-center text-left">
        <span
          className={`font-serif font-extrabold ${titleSize} tracking-tight leading-tight flex items-center gap-0.5 ${
            isDark ? 'text-white' : 'text-[#0c2419]'
          }`}
        >
          Herb<span className="text-emerald-600 font-sans font-bold">Trace</span>
        </span>

        {showSubtitle && (
          <span
            className={`font-semibold tracking-normal leading-tight mt-0.5 ${subtitleSize} ${
              isDark ? 'text-emerald-300/90' : 'text-[#166534]'
            }`}
          >
            Blockchain-Based Botanical Traceability System for Ayurvedic Herbs
          </span>
        )}
      </div>
    </div>
  );
};

export default HerbTraceLogo;
