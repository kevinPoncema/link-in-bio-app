import AuthRequest from './AuthRequest';

// Obtener la URL base desde las variables de entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ProfileRequest {
  /**
   * Obtiene el token de autenticación del usuario
   * @returns {string} Token de autenticación
   * @throws {Error} Si no hay token disponible
   */
  static getAuthToken() {
    const token = AuthRequest.getToken();
    if (!token) {
      throw new Error('No hay sesión activa. Por favor, inicia sesión.');
    }
    return token;
  }

  /**
   * Obtiene los headers con autenticación Bearer
   * @returns {Object} Headers con token de autenticación
   */
  static getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`,
    };
  }

  /**
   * Crea un nuevo perfil
   * @param {Object} profileData - Datos del perfil
   * @param {string} profileData.main_title - Título principal del perfil
   * @param {string} profileData.slug - Slug único del perfil
   * @param {string} profileData.description - Descripción del perfil
   * @param {string} profileData.profile_picture - URL o base64 de la imagen de perfil
   * @returns {Promise<Object>} Perfil creado
   */
  static async createProfile(profileData) {
    try {
      const response = await fetch(`${BASE_URL}/api/profiles`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          main_title: profileData.main_title,
          slug: profileData.slug,
          description: profileData.description,
          profile_picture: profileData.profile_picture || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el perfil');
      }

      return data;
    } catch (error) {
      console.error('Error en createProfile:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los perfiles del usuario autenticado
   * @returns {Promise<Array>} Lista de perfiles del usuario
   */
  static async getAllProfiles() {
    try {
      const response = await fetch(`${BASE_URL}/api/profiles`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los perfiles');
      }

      return data;
    } catch (error) {
      console.error('Error en getAllProfiles:', error);
      throw error;
    }
  }

  /**
   * Obtiene un perfil específico por su ID o slug (PÚBLICO)
   * @param {number|string} identifier - ID o slug del perfil
   * @returns {Promise<Object>} Datos del perfil
   */
  static async getProfileById(identifier) {
    try {
      const response = await fetch(`${BASE_URL}/api/profiles/${identifier}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el perfil');
      }

      return data;
    } catch (error) {
      console.error('Error en getProfileById:', error);
      throw error;
    }
  }

  /**
   * Actualiza un perfil existente
   * @param {number|string} profileId - ID del perfil a actualizar
   * @param {Object} profileData - Datos actualizados del perfil
   * @param {string} profileData.main_title - Título principal del perfil
   * @param {string} profileData.slug - Slug único del perfil
   * @param {string} profileData.description - Descripción del perfil
   * @param {number} profileData.theme_id - ID del tema del perfil
   * @param {string} profileData.profile_picture - URL o base64 de la imagen de perfil
   * @returns {Promise<Object>} Perfil actualizado
   */
  static async updateProfile(profileId, profileData) {
    try {
      const response = await fetch(`${BASE_URL}/api/profiles/${profileId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          main_title: profileData.main_title,
          slug: profileData.slug,
          description: profileData.description,
          theme_id: profileData.theme_id || 1,
          profile_picture: profileData.profile_picture || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

      return data;
    } catch (error) {
      console.error('Error en updateProfile:', error);
      throw error;
    }
  }

  /**
   * Elimina un perfil
   * @param {number|string} profileId - ID del perfil a eliminar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async deleteProfile(profileId) {
    try {
      const response = await fetch(`${BASE_URL}/api/profiles/${profileId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        // Intentar leer el error si hay contenido
        let errorMessage = 'Error al eliminar el perfil';
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (e) {
          // Si no hay JSON, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      // Si la respuesta es exitosa pero no tiene contenido (204 No Content)
      // retornar un objeto de éxito
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true, message: 'Perfil eliminado exitosamente' };
      }

      // Si hay contenido, intentar parsearlo
      try {
        const data = await response.json();
        return data;
      } catch (e) {
        // Si no se puede parsear, retornar éxito de todas formas
        return { success: true, message: 'Perfil eliminado exitosamente' };
      }
    } catch (error) {
      console.error('Error en deleteProfile:', error);
      throw error;
    }
  }
}

export default ProfileRequest;
