# Sistema de Temas Personalizados

## Descripción General

El sistema de temas permite personalizar completamente la apariencia de los perfiles públicos con colores únicos, gradientes y fondos de imagen. Los temas se aplican tanto en el perfil público como en la vista de edición (como previsualización).

## Componentes del Sistema

### 1. ThemesRequest.js (`/frontend/src/api/ThemesRequest.js`)

Clase centralizada que gestiona todos los temas disponibles.

**Temas disponibles:**
- `default` - Tema por defecto (naranja y rosa)
- `gradient-sunset` - Atardecer cálido
- `ocean-blue` - Océano azul
- `forest-green` - Bosque verde
- `purple-night` - Noche púrpura
- `sunset-pink` - Rosa atardecer

**Métodos:**
```javascript
ThemesRequest.getAllThemes()        // Obtiene todos los temas
ThemesRequest.getAvailableThemes()  // Filtra solo temas disponibles
ThemesRequest.getThemeById(id)      // Obtiene tema específico
ThemesRequest.isThemeAvailable(id)  // Verifica disponibilidad
ThemesRequest.getThemeColors(id)    // Obtiene paleta de colores
ThemesRequest.getThemeName(id)      // Obtiene nombre del tema
```

### 2. ThemeProvider.jsx (`/frontend/src/components/ThemeProvider.jsx`)

Componente wrapper que aplica los estilos del tema a toda la página.

**Características:**
- Imagen de fondo adaptable con `background-size: cover`
- Overlay oscuro semi-transparente para mejorar legibilidad
- Gradiente de fondo cuando no hay imagen
- CSS Variables para uso en componentes hijos
- Indicador de vista previa (opcional)

**Uso:**
```jsx
import ThemeProvider from '../components/ThemeProvider';

<ThemeProvider themeName="ocean-blue" preview={false}>
  {/* Tu contenido aquí */}
</ThemeProvider>
```

**CSS Variables disponibles:**
```css
--theme-primary    /* Color primario del tema */
--theme-secondary  /* Color secundario del tema */
--theme-background /* Color de fondo del tema */
```

### 3. Hook: useThemeColors

Hook personalizado para acceder a los colores del tema actual desde cualquier componente hijo.

**Uso:**
```jsx
import { useThemeColors } from '../components/ThemeProvider';

const MyComponent = () => {
  const themeColors = useThemeColors(themeName);
  
  return (
    <div style={{ borderColor: themeColors.primary }}>
      {/* Contenido */}
    </div>
  );
};
```

## Implementación en Perfiles

### Perfil Público (`PublicProfile.jsx`)

El perfil público aplica automáticamente el tema seleccionado por el usuario:

1. Carga el tema desde `profile.theme_name`
2. Envuelve todo el contenido en `<ThemeProvider>`
3. Usa `useThemeColors` para aplicar colores dinámicos
4. Elementos con colores personalizados:
   - Bordes de cards y botones
   - Avatar con gradiente
   - Iconos de links
   - Enlaces hover
   - Badge de tema

**Características visuales:**
- Fondo de imagen fija (`background-attachment: fixed`)
- Cards semi-transparentes con blur (`backdrop-blur-sm`)
- Transiciones suaves en hover
- Sombras con color del tema

### Perfil de Edición (`ProfileEdit.jsx`)

Vista de edición con previsualización en tiempo real:

1. Botón "Vista Previa" en el header
2. Al activar previsualización:
   - Se aplica el tema en toda la página
   - Aparece indicador flotante "Vista Previa: [nombre tema]"
   - Formulario adapta colores (bordes, focus, botones)
3. Selector de temas actualiza vista instantáneamente

**Componente ProfileFormSection:**
- Usa `useThemeColors` para colores dinámicos
- Bordes con opacidad del color primario
- Avatar con gradiente del tema
- Inputs con focus-ring del color del tema

## Estructura de un Tema

Cada tema en `ThemesRequest.js` tiene la siguiente estructura:

```javascript
{
  id: 'theme-id',                    // Identificador único
  name: 'Theme Name',                // Nombre visible
  available: true,                   // Disponibilidad
  preview: 'url-imagen' || null,     // URL de imagen de fondo (opcional)
  colors: {
    primary: '#hex',                 // Color primario
    secondary: '#hex',               // Color secundario
    background: '#hex',              // Color de fondo base
  }
}
```

## Agregar un Nuevo Tema

Para agregar un tema nuevo:

1. Abre `/frontend/src/api/ThemesRequest.js`
2. Agrega objeto al array `themes`:

```javascript
{
  id: 'mi-tema',
  name: 'Mi Tema',
  available: true,
  preview: 'https://url-de-imagen.jpg',
  colors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    background: '#1A1A2E',
  }
}
```

3. El tema aparecerá automáticamente en el selector

## Adaptación de Imagen de Fondo

Las imágenes se adaptan usando:

```css
background-size: cover;        /* Cubre todo el contenedor */
background-position: center;   /* Centrado */
background-repeat: no-repeat;  /* Sin repetición */
background-attachment: fixed;  /* Fijo al scroll (parallax) */
```

**Overlay para legibilidad:**
```css
background: linear-gradient(
  to bottom, 
  rgba(0,0,0,0.6),  /* 60% opacidad arriba */
  rgba(0,0,0,0.8)   /* 80% opacidad abajo */
);
```

## Mejores Prácticas

### Imágenes de Fondo
- Usar imágenes de alta resolución (mínimo 1920x1080)
- Preferir URLs de CDN (ej: Unsplash)
- Considerar peso de imagen (optimizar para web)
- Probar en diferentes tamaños de pantalla

### Colores
- Asegurar contraste suficiente con texto blanco
- Primary: Color dominante del tema
- Secondary: Color complementario para gradientes
- Background: Color sólido de respaldo

### Transparencias
- Cards: `bg-gray-800/90` (90% opacidad)
- Backdrop blur: `backdrop-blur-sm` para efecto cristal
- Bordes: Usar color primario con 40% opacidad

## Testing

Para probar un tema:

1. Ir a "Editar Perfil"
2. Seleccionar tema del selector
3. Activar "Vista Previa"
4. Verificar:
   - Imagen de fondo se adapta correctamente
   - Texto legible sobre imagen
   - Colores se aplican en todos los elementos
   - Transiciones suaves
   - Responsive en móvil

## Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Mobile browsers
- ✅ Tablet/Desktop

## Performance

**Optimizaciones aplicadas:**
- Temas cargados síncronamente (sin async)
- CSS en línea para evitar FOUC (Flash of Unstyled Content)
- Imágenes lazy-loaded cuando sea posible
- Backdrop-filter con fallback

## Futuras Mejoras

- [ ] Subida de imagen de fondo personalizada
- [ ] Editor de colores personalizado
- [ ] Temas con animaciones
- [ ] Modo oscuro/claro por tema
- [ ] Exportar/importar temas personalizados
