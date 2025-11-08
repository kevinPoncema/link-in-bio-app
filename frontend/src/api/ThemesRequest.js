// Lista de temas disponibles para los perfiles
const themes = [
  {
    id: 'default',
    name: 'Default',
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
    available: true,
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
    available: true,
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
    available: true,
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
    available: true,
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
    available: true,
    preview: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      background: '#831843',
    }
  },
];

class ThemesRequest {
  /**
   * Obtener todos los temas disponibles
   * @returns {Array} Lista de temas
   */
  static getAllThemes() {
    return themes;
  }

  /**
   * Obtener solo los temas disponibles
   * @returns {Array} Lista de temas disponibles
   */
  static getAvailableThemes() {
    return themes.filter(theme => theme.available);
  }

  /**
   * Obtener un tema por su ID
   * @param {string} themeId - ID del tema
   * @returns {Object|null} Tema encontrado o null
   */
  static getThemeById(themeId) {
    return themes.find(t => t.id === themeId) || null;
  }

  /**
   * Verificar si un tema está disponible
   * @param {string} themeId - ID del tema
   * @returns {boolean} True si está disponible
   */
  static isThemeAvailable(themeId) {
    const theme = themes.find(t => t.id === themeId);
    return theme ? theme.available : false;
  }

  /**
   * Obtener los colores de un tema
   * @param {string} themeId - ID del tema
   * @returns {Object|null} Objeto con colores o null
   */
  static getThemeColors(themeId) {
    const theme = themes.find(t => t.id === themeId);
    return theme ? theme.colors : null;
  }

  /**
   * Obtener el nombre de un tema
   * @param {string} themeId - ID del tema
   * @returns {string} Nombre del tema o 'Default'
   */
  static getThemeName(themeId) {
    const theme = themes.find(t => t.id === themeId);
    return theme ? theme.name : 'Default';
  }
}

export default ThemesRequest;
