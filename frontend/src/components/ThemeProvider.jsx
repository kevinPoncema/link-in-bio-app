import React, { useState, useEffect } from 'react';
import ThemesRequest from '../api/ThemesRequest';

/**
 * Tema por defecto mientras se carga el tema real
 */
const DEFAULT_THEME = {
  id: 1,
  name: 'Default',
  preview_url: null,
  primary_color: '#FF6B6B',
  secondary_color: '#FFA500',
  background_color: '#1a1a1a',
  is_custom: false,
};

/**
 * Componente que aplica estilos de tema a sus hijos
 * Soporta colores personalizados y imagen de fondo
 */
const ThemeProvider = ({ themeId = 1, children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        setLoading(true);
        const loadedTheme = await ThemesRequest.getThemeById(themeId);
        setTheme(loadedTheme);
      } catch (error) {
        console.error('Error al cargar tema:', error);
        // Usar tema por defecto en caso de error
        setTheme(DEFAULT_THEME);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [themeId]);

  // Estilos para el contenedor principal
  const containerStyle = {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  };

  // Estilos para la imagen de fondo
  const backgroundStyle = theme.preview_url ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundImage: `url(${theme.preview_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  } : null;

  // Overlay oscuro sobre la imagen para mejorar legibilidad (reducido)
  const overlayStyle = theme.preview_url ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    background: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))`,
  } : null;

  // Estilos para el fondo con gradiente (cuando no hay imagen)
  const gradientStyle = !theme.preview_url ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    background: `linear-gradient(135deg, ${theme.background_color} 0%, ${theme.primary_color}15 100%)`,
  } : null;

  // Contenedor del contenido (sobre el fondo)
  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    minHeight: '100vh',
  };

  // CSS Variables para usar en los componentes hijos
  const cssVariables = {
    '--theme-primary': theme.primary_color,
    '--theme-secondary': theme.secondary_color,
    '--theme-background': theme.background_color,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando tema...</div>
      </div>
    );
  }

  return (
    <div style={{ ...containerStyle, ...cssVariables }}>
      {/* Imagen de fondo */}
      {backgroundStyle && <div style={backgroundStyle} />}
      
      {/* Overlay oscuro */}
      {overlayStyle && <div style={overlayStyle} />}
      
      {/* Gradiente de fondo (si no hay imagen) */}
      {gradientStyle && <div style={gradientStyle} />}
      
      {/* Contenido */}
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

/**
 * Hook personalizado para obtener los colores del tema actual
 */
export const useThemeColors = (themeId = 1) => {
  const [colors, setColors] = useState({
    primary: '#FF6B6B',
    secondary: '#FFA500',
    background: '#1a1a1a',
  });

  useEffect(() => {
    const loadColors = async () => {
      try {
        const theme = await ThemesRequest.getThemeById(themeId);
        setColors({
          primary: theme.primary_color,
          secondary: theme.secondary_color,
          background: theme.background_color,
        });
      } catch (error) {
        console.error('Error al cargar colores del tema:', error);
        // Mantener colores por defecto
      }
    };

    loadColors();
  }, [themeId]);

  return colors;
};

export default ThemeProvider;
