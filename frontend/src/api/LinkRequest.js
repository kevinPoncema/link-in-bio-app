import AuthRequest from './AuthRequest';

// Obtener la URL base desde las variables de entorno
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class LinkRequest {
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
   * Obtiene los headers sin autenticación (para rutas públicas)
   * @returns {Object} Headers básicos
   */
  static getPublicHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Obtiene todos los links de un perfil (PÚBLICO)
   * @param {number|string} profileId - ID del perfil
   * @returns {Promise<Array>} Lista de links del perfil
   */
  static async getLinksByProfile(profileId) {
    try {
      const response = await fetch(`${BASE_URL}/api/profiles/${profileId}/links`, {
        method: 'GET',
        headers: this.getPublicHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener los links');
      }

      return data;
    } catch (error) {
      console.error('Error en getLinksByProfile:', error);
      throw error;
    }
  }

  /**
   * Obtiene un link específico por su ID (PÚBLICO)
   * @param {number|string} linkId - ID del link
   * @returns {Promise<Object>} Datos del link
   */
  static async getLinkById(linkId) {
    try {
      const response = await fetch(`${BASE_URL}/api/links/${linkId}`, {
        method: 'GET',
        headers: this.getPublicHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener el link');
      }

      return data;
    } catch (error) {
      console.error('Error en getLinkById:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo link
   * @param {Object} linkData - Datos del link
   * @param {number} linkData.profile_id - ID del perfil
   * @param {string} linkData.title - Título del link
   * @param {string} linkData.url - URL del link
   * @param {string} linkData.icon_class - Clase del icono (opcional)
   * @param {number} linkData.order - Orden del link (opcional)
   * @returns {Promise<Object>} Link creado
   */
  static async createLink(linkData) {
    try {
      const response = await fetch(`${BASE_URL}/api/links`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          profile_id: linkData.profile_id,
          title: linkData.title,
          url: linkData.url,
          icon_class: linkData.icon_class || null,
          order: linkData.order || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el link');
      }

      return data;
    } catch (error) {
      console.error('Error en createLink:', error);
      throw error;
    }
  }

  /**
   * Actualiza un link existente
   * @param {number|string} linkId - ID del link a actualizar
   * @param {Object} linkData - Datos actualizados del link
   * @param {string} linkData.title - Título del link
   * @param {string} linkData.url - URL del link
   * @param {string} linkData.icon_class - Clase del icono (opcional)
   * @param {number} linkData.order - Orden del link (opcional)
   * @returns {Promise<Object>} Link actualizado
   */
  static async updateLink(linkId, linkData) {
    try {
      const response = await fetch(`${BASE_URL}/api/links/${linkId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          title: linkData.title,
          url: linkData.url,
          icon_class: linkData.icon_class || null,
          order: linkData.order || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el link');
      }

      return data;
    } catch (error) {
      console.error('Error en updateLink:', error);
      throw error;
    }
  }

  /**
   * Elimina un link
   * @param {number|string} linkId - ID del link a eliminar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async deleteLink(linkId) {
    try {
      const response = await fetch(`${BASE_URL}/api/links/${linkId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        // Intentar leer el error si hay contenido
        let errorMessage = 'Error al eliminar el link';
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (e) {
          // Si no hay JSON, usar el mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      // Si la respuesta es exitosa pero no tiene contenido (204 No Content)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { success: true, message: 'Link eliminado exitosamente' };
      }

      // Si hay contenido, intentar parsearlo
      try {
        const data = await response.json();
        return data;
      } catch (e) {
        // Si no se puede parsear, retornar éxito de todas formas
        return { success: true, message: 'Link eliminado exitosamente' };
      }
    } catch (error) {
      console.error('Error en deleteLink:', error);
      throw error;
    }
  }

  /**
   * Actualiza el orden de múltiples links
   * @param {Array} linksOrder - Array de objetos con id y order
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async updateLinksOrder(linksOrder) {
    try {
      // Este endpoint necesitará ser implementado en el backend
      const promises = linksOrder.map(link => 
        this.updateLink(link.id, { order: link.order })
      );
      
      await Promise.all(promises);
      
      return { success: true, message: 'Orden actualizado exitosamente' };
    } catch (error) {
      console.error('Error en updateLinksOrder:', error);
      throw error;
    }
  }
}

export default LinkRequest;
