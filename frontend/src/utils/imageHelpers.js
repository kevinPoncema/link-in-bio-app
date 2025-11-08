/**
 * Procesa la URL de la imagen para asegurarse de que sea una URL completa
 * Si la URL ya incluye http:// o https://, la retorna tal cual
 * Si es una URL relativa, la concatena con la URL base del backend
 * 
 * @param {string|null} imageUrl - URL de la imagen (puede ser null, relativa o absoluta)
 * @returns {string|null} - URL completa de la imagen o null
 */
export const getFullImageUrl = (imageUrl) => {
  // Si no hay imagen, retornar null
  if (!imageUrl) {
    return null;
  }

  // Si es una imagen base64, retornarla tal cual
  if (imageUrl.startsWith('data:image')) {
    return imageUrl;
  }

  // Si ya es una URL completa (incluye http:// o https://), retornarla tal cual
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Si es una URL relativa, concatenar con la URL base del backend
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;

  return `${cleanBaseUrl}${cleanImageUrl}`;
};

/**
 * Valida si un archivo es una imagen válida
 * 
 * @param {File} file - Archivo a validar
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateImageFile = (file) => {
  // Verificar que sea una imagen
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'Por favor selecciona un archivo de imagen válido'
    };
  }

  // Verificar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'La imagen es muy grande. El tamaño máximo es 5MB'
    };
  }

  return {
    valid: true,
    error: null
  };
};

/**
 * Convierte un archivo a base64
 * 
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} - String base64 de la imagen
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
};
