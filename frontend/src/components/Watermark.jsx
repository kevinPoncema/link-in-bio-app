import React from 'react';
import { useThemeColors } from './ThemeProvider';

/**
 * Componente de marca de agua
 * Se muestra solo para usuarios no premium
 */
const Watermark = ({ profile, themeId = 1 }) => {
  const themeColors = useThemeColors(themeId);

  // Verificar si el usuario es premium
  const isPremium = profile?.IsFromPremiumUser === true;

  // No mostrar nada si es usuario premium
  if (isPremium) {
    return null;
  }

  return (
    <div className="mb-4">
      <a
        href="https://kevinponcedev.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/60 backdrop-blur-md rounded-full border transition-all hover:scale-105"
        style={{ 
          borderColor: `${themeColors.primary}40`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = themeColors.primary;
          e.currentTarget.style.backgroundColor = `${themeColors.primary}20`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${themeColors.primary}40`;
          e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.6)';
        }}
      >
        <span className="text-xs sm:text-sm font-semibold text-gray-300">
          Desarrollado por{' '}
          <span 
            className="font-bold transition-colors"
            style={{ color: themeColors.primary }}
          >
            Kevin Ponce
          </span>
        </span>
      </a>
    </div>
  );
};

export default Watermark;
