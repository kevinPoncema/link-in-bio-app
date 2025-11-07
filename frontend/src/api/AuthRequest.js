// Obtener la URL base desde las variables de entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthRequest {
  /**
   * Constantes para las keys de almacenamiento
   * Usar nombres genéricos para facilitar cambio a sessionStorage o cookies
   */
  static STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    REMEMBER_SESSION: 'remember_session'
  };

  /**
   * Métodos genéricos de almacenamiento
   * Permite cambiar fácilmente entre localStorage, sessionStorage o cookies
   */
  static setStorage(key, value, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  }

  static getStorage(key) {
    // Intenta obtener de localStorage primero, luego sessionStorage
    let value = localStorage.getItem(key);
    if (!value) {
      value = sessionStorage.getItem(key);
    }
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  static removeStorage(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  static clearAllStorage() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      this.removeStorage(key);
    });
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña
   * @param {string} userData.password_confirmation - Confirmación de contraseña
   * @param {boolean} userData.remember - Si se debe recordar la sesión
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async register(userData) {
    try {
      const remember = userData.remember || false;
      
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

      // Guardar el token y datos del usuario si existen
      if (data.access_token) {
        this.setStorage(this.STORAGE_KEYS.AUTH_TOKEN, data.access_token, remember);
        this.setStorage(this.STORAGE_KEYS.REMEMBER_SESSION, remember, remember);
      }
      
      if (data.user) {
        this.setStorage(this.STORAGE_KEYS.USER_DATA, data.user, remember);
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
   * @param {boolean} credentials.remember - Si se debe recordar la sesión
   * @returns {Promise<Object>} Respuesta del servidor con el token
   */
  static async login(credentials) {
    try {
      const remember = credentials.remember || false;
      
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

      // Guardar el token en el storage apropiado según 'remember'
      if (data.access_token) {
        this.setStorage(this.STORAGE_KEYS.AUTH_TOKEN, data.access_token, remember);
        this.setStorage(this.STORAGE_KEYS.REMEMBER_SESSION, remember, remember);
      }
      
      if (data.user) {
        this.setStorage(this.STORAGE_KEYS.USER_DATA, data.user, remember);
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
      const token = this.getStorage(this.STORAGE_KEYS.AUTH_TOKEN);

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

      // Limpiar todos los datos de almacenamiento
      this.clearAllStorage();

      return data;
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  /**
   * Verifica si hay una sesión activa
   * @returns {boolean}
   */
  static isAuthenticated() {
    return !!this.getStorage(this.STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Obtiene el token de autenticación actual
   * @returns {string|null}
   */
  static getToken() {
    return this.getStorage(this.STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Obtiene los datos del usuario actual
   * @returns {Object|null}
   */
  static getCurrentUser() {
    return this.getStorage(this.STORAGE_KEYS.USER_DATA);
  }
}

export default AuthRequest;
