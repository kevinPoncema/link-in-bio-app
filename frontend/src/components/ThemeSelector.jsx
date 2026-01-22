import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import ThemesRequest from '../api/ThemesRequest';

const ThemeSelector = ({ selectedTheme, onThemeChange, disabled = false }) => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar temas al montar el componente
  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const data = await ThemesRequest.getAllThemes();
      setThemes(data);
    } catch (error) {
      console.error('Error al cargar temas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSelect = (themeId) => {
    if (!disabled) {
      onThemeChange(themeId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        <span className="ml-2 text-gray-400 text-sm">Cargando temas...</span>
      </div>
    );
  }

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
                  disabled={disabled}
                  className={`
                    relative overflow-hidden rounded-xl border-2 transition-all text-left bg-gray-700/60 backdrop-blur-sm
                    ${selectedTheme == theme.id 
                      ? 'border-orange-500 shadow-lg shadow-orange-500/20' 
                      : 'border-gray-700 hover:border-gray-600'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center p-3 h-[72px]">
                    {/* Preview Section */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden mr-3">
                      {theme.preview_url ? (
                        <img
                          src={theme.preview_url}
                          alt={theme.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${theme.primary_color}, ${theme.secondary_color})` 
                          }}
                        >
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-white">
                          {theme.name}
                        </h4>
                        {theme.is_custom && (
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Selected Indicator */}
                      {selectedTheme == theme.id && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center ml-2">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Color Indicators */}
                  <div className="flex gap-1 px-3 pb-2">
                    <div
                      className="flex-1 h-1 rounded-full"
                      style={{ backgroundColor: theme.primary_color }}
                    />
                    <div
                      className="flex-1 h-1 rounded-full"
                      style={{ backgroundColor: theme.secondary_color }}
                    />
                    <div
                      className="flex-1 h-1 rounded-full"
                      style={{ backgroundColor: theme.background_color }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
