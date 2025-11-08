import React from 'react';
import ThemesRequest from '../api/ThemesRequest';

/**
 * Componente que aplica estilos de tema a sus hijos
 * Soporta colores personalizados y imagen de fondo
 */
const ThemeProvider = ({ themeName = 'default', children, preview = false }) => {
  const theme = ThemesRequest.getThemeById(themeName) || ThemesRequest.getThemeById('default');

  // Estilos para el contenedor principal
  const containerStyle = {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
  };

  // Estilos para la imagen de fondo
  const backgroundStyle = theme.preview ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    backgroundImage: `url(${theme.preview})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  } : null;

  // Overlay oscuro sobre la imagen para mejorar legibilidad
  const overlayStyle = theme.preview ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    background: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))`,
  } : null;

  // Estilos para el fondo con gradiente (cuando no hay imagen)
  const gradientStyle = !theme.preview ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    background: `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.primary}15 100%)`,
  } : null;

  // Contenedor del contenido (sobre el fondo)
  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    minHeight: '100vh',
  };

  // CSS Variables para usar en los componentes hijos
  const cssVariables = {
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-background': theme.colors.background,
  };

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

      {/* Indicador de preview */}
      {preview && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: 'white',
          border: `2px solid ${theme.colors.primary}`,
        }}>
          <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>●</span> Vista Previa: {theme.name}
        </div>
      )}
    </div>
  );
};

/**
 * Hook personalizado para obtener los colores del tema actual
 */
export const useThemeColors = (themeName = 'default') => {
  const theme = ThemesRequest.getThemeById(themeName) || ThemesRequest.getThemeById('default');
  return theme.colors;
};

export default ThemeProvider;
