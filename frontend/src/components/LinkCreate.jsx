import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';

const LinkCreate = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  profileId, 
  loading = false, 
  error = '',
  editingLink = null // Link existente para editar
}) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon_class: ''
  });

  // Cargar datos cuando se está editando
  useEffect(() => {
    if (editingLink) {
      setFormData({
        title: editingLink.title || '',
        url: editingLink.url || '',
        icon_class: editingLink.icon_class || ''
      });
    } else {
      setFormData({
        title: '',
        url: '',
        icon_class: ''
      });
    }
  }, [editingLink, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.title.trim() || !formData.url.trim()) {
      return;
    }

    // Crear el objeto completo del link
    const linkData = {
      title: formData.title.trim(),
      url: formData.url.trim(),
      icon_class: formData.icon_class.trim() || null,
    };

    // Si estamos editando, incluir el id
    if (editingLink) {
      linkData.id = editingLink.id;
      linkData.order = editingLink.order; // Mantener el orden original
      linkData.is_active = editingLink.is_active;
    } else {
      // Si estamos creando, agregar campos de creación
      linkData.profile_id = profileId;
      linkData.order = 777; // Valor temporal
      linkData.is_active = true;
    }

    onSubmit(linkData);
  };

  const handleClose = () => {
    if (!loading) {
      // Limpiar formulario al cerrar
      setFormData({
        title: '',
        url: '',
        icon_class: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {editingLink ? 'Editar Link' : 'Crear Nuevo Link'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-3 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Título del Link */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Título del Link <span className="text-red-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ej: Mi GitHub"
              />
            </div>

            {/* URL del Link */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                URL <span className="text-red-400">*</span>
              </label>
              <input
                id="url"
                name="url"
                type="url"
                required
                value={formData.url}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="https://ejemplo.com"
              />
              <p className="text-xs text-gray-500 mt-2">
                Debe ser una URL válida que comience con http:// o https://
              </p>
            </div>

            {/* Clase de Icono */}
            <div>
              <label htmlFor="icon_class" className="block text-sm font-medium text-gray-300 mb-2">
                Clase de Icono <span className="text-gray-500">(Opcional)</span>
              </label>
              <input
                id="icon_class"
                name="icon_class"
                type="text"
                value={formData.icon_class}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ej: fab fa-github"
              />
              <p className="text-xs text-gray-500 mt-2">
                Clase CSS del icono (FontAwesome, Lucide, etc.)
              </p>
            </div>

            {/* Info sobre el orden */}
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
              <p className="text-xs text-blue-300">
                💡 El orden se establecerá automáticamente. Podrás reordenar los links más adelante.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 mt-8">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{editingLink ? 'Actualizando...' : 'Guardando...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{editingLink ? 'Actualizar' : 'Crear Link'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkCreate;
