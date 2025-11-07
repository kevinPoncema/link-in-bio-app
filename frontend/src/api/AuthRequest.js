// Obtener la URL base desde las variables de entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthRequest {
  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña
   * @param {string} userData.password_confirmation - Confirmación de contraseña
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async register(userData) {
    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          password_confirmation: userData.password_confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
      }

      return data;
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  }

  /**
   * Inicia sesión de un usuario
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña
   * @returns {Promise<Object>} Respuesta del servidor con el token
   */
  static async login(credentials) {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar el token en localStorage si existe
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async logout() {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`${BASE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al cerrar sesión');
      }

      // Eliminar el token del localStorage
      localStorage.removeItem('auth_token');

      return data;
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }
}

export default AuthRequest;
