// Obtener la URL base desde las variables de entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ThemesRequest {
  /**
   * Método helper para hacer peticiones con manejo de errores
   */
  static async request(url, options = {}) {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Error en petición:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los temas (sistema + personalizados del usuario)
   * @returns {Promise<Array>} Lista de temas
   */
  static async getAllThemes() {
    const data = await this.request(`${BASE_URL}/api/themes`, {
      method: 'GET',
    });
    return data.data || data;
  }

  /**
   * Obtener un tema por su ID
   * @param {number} themeId - ID del tema
   * @returns {Promise<Object>} Tema encontrado
   */
  static async getThemeById(themeId) {
    const data = await this.request(`${BASE_URL}/api/themes/${themeId}`, {
      method: 'GET',
    });
    return data.data || data;
  }

  /**
   * Crear un nuevo tema personalizado
   * @param {Object} themeData - Datos del tema
   * @returns {Promise<Object>} Tema creado
   */
  static async createTheme(themeData) {
    const data = await this.request(`${BASE_URL}/api/themes`, {
      method: 'POST',
      body: JSON.stringify(themeData),
    });
    return data.data || data;
  }

  /**
   * Actualizar un tema existente
   * @param {number} themeId - ID del tema
   * @param {Object} themeData - Datos a actualizar
   * @returns {Promise<Object>} Tema actualizado
   */
  static async updateTheme(themeId, themeData) {
    const data = await this.request(`${BASE_URL}/api/themes/${themeId}`, {
      method: 'PUT',
      body: JSON.stringify(themeData),
    });
    return data.data || data;
  }

  /**
   * Eliminar un tema personalizado
   * @param {number} themeId - ID del tema
   * @returns {Promise<Object>} Respuesta de la eliminación
   */
  static async deleteTheme(themeId) {
    return await this.request(`${BASE_URL}/api/themes/${themeId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Validar un color hexadecimal
   * @param {string} color - Color en formato hex
   * @returns {boolean} True si es válido
   */
  static isValidHexColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
  }

  /**
   * Obtener los colores de un tema
   * @param {Object} theme - Objeto tema
   * @returns {Object} Objeto con colores
   */
  static getThemeColors(theme) {
    return {
      primary: theme.primary_color,
      secondary: theme.secondary_color,
      background: theme.background_color,
    };
  }
}

export default ThemesRequest;
