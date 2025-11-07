import React from 'react';
import { Check, Lock } from 'lucide-react';

const ThemeSelector = ({ selectedTheme, onThemeChange, disabled = false }) => {
  // Lista de temas disponibles y futuros
  const themes = [
    {
      id: 'default',
      name: 'Default',
      description: 'Tema predeterminado limpio y minimalista',
      available: true,
      preview: null, // Sin imagen de fondo
      colors: {
        primary: '#f97316', // orange-500
        secondary: '#ec4899', // pink-500
        background: '#1f2937', // gray-800
      }
    },
    {
      id: 'gradient-sunset',
      name: 'Gradient Sunset',
      description: 'Degradado cálido de atardecer',
      available: false,
      preview: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      colors: {
        primary: '#f59e0b',
        secondary: '#ef4444',
        background: '#1e293b',
      }
    },
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      description: 'Tonos azules del océano',
      available: false,
      preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
      colors: {
        primary: '#3b82f6',
        secondary: '#06b6d4',
        background: '#0f172a',
      }
    },
    {
      id: 'forest-green',
      name: 'Forest Green',
      description: 'Naturaleza y tonos verdes',
      available: false,
      preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
      colors: {
        primary: '#10b981',
        secondary: '#059669',
        background: '#064e3b',
      }
    },
    {
      id: 'purple-night',
      name: 'Purple Night',
      description: 'Elegancia nocturna púrpura',
      available: false,
      preview: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop',
      colors: {
        primary: '#a855f7',
        secondary: '#8b5cf6',
        background: '#581c87',
      }
    },
    {
      id: 'sunset-pink',
      name: 'Sunset Pink',
      description: 'Rosa vibrante y energético',
      available: false,
      preview: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
      colors: {
        primary: '#ec4899',
        secondary: '#f472b6',
        background: '#831843',
      }
    },
  ];

  const handleThemeSelect = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme && theme.available && !disabled) {
      onThemeChange(themeId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-300">Tema del Perfil</h3>
          <p className="text-xs text-gray-500 mt-1">
            Personaliza la apariencia de tu perfil
          </p>
        </div>
      </div>

      {/* Container con scroll - máximo 3 temas visibles */}
      <div className="relative">
        <div 
          className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
          style={{ 
            maxHeight: 'calc(3 * 96px + 2 * 12px)', // 3 temas * altura(96px) + 2 gaps(12px)
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch' // Scroll suave en iOS
          }}
        >
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleThemeSelect(theme.id)}
              disabled={!theme.available || disabled}
              className={`
                relative overflow-hidden rounded-xl border-2 transition-all text-left
                ${selectedTheme === theme.id 
                  ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
                }
                ${!theme.available ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center p-3">
                {/* Preview Section */}
                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden mr-4">
                  {theme.preview ? (
                    <img
                      src={theme.preview}
                      alt={theme.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` 
                      }}
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white/40 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-white truncate">
                      {theme.name}
                    </h4>
                    {!theme.available && (
                      <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {theme.description}
                  </p>
                  
                  {/* Color Palette */}
                  <div className="flex items-center space-x-1 mt-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.colors.primary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.colors.secondary }}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: theme.colors.background }}
                    ></div>
                  </div>
                </div>

                {/* Selected Indicator */}
                {selectedTheme === theme.id && theme.available && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Coming Soon Badge */}
                {!theme.available && (
                  <div className="flex-shrink-0 ml-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-400 font-medium">
                      Próximamente
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {/* Indicador de scroll (gradient fade) */}
        {themes.length > 3 && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
        <p className="text-xs text-blue-300">
          💡 <span className="font-semibold">Próximamente:</span> Más temas con fondos personalizados, 
          colores y estilos únicos para hacer tu perfil destacar.
        </p>
      </div>
    </div>
  );
};

export default ThemeSelector;
