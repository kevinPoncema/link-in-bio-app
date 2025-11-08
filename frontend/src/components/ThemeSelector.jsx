import React, { useState, useEffect } from 'react';
import { Check, Lock } from 'lucide-react';
import ThemesRequest from '../api/ThemesRequest';

const ThemeSelector = ({ selectedTheme, onThemeChange, disabled = false }) => {
  const [themes, setThemes] = useState([]);

  // Cargar temas al montar el componente
  useEffect(() => {
    const themesData = ThemesRequest.getAllThemes();
    setThemes(themesData);
  }, []);

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

      {/* Temas */}
      {themes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No hay temas disponibles</p>
        </div>
      ) : (
        <>
          {/* Container con scroll - máximo 3 temas visibles */}
          <div className="relative">
            <div 
              className="grid grid-cols-1 gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500"
              style={{ 
                maxHeight: 'calc(3 * 84px + 2 * 12px)', // 3 temas * altura(84px) + 2 gaps(12px)
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
                  <div className="flex items-center p-3 h-[72px]">
                    {/* Preview Section */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden mr-3">
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
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="flex-1 min-w-0 flex items-center">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-white">
                          {theme.name}
                        </h4>
                        {!theme.available && (
                          <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {selectedTheme === theme.id && theme.available && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Coming Soon Badge */}
                    {!theme.available && (
                      <div className="flex-shrink-0 ml-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-400 font-medium whitespace-nowrap">
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
              💡 <span className="font-semibold">Disponibles:</span> Todos los temas están ahora disponibles.
              Personaliza tu perfil con el estilo que más te guste.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
