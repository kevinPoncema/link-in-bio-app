import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';

const ProfileForm = ({ isOpen, onClose, onSubmit, initialData = null, loading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    main_title: '',
    slug: '',
    description: '',
  });
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        main_title: initialData.main_title || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
      });
      setSlugEdited(true); // Si hay datos iniciales, consideramos que el slug ya fue editado
    } else {
      setFormData({
        main_title: '',
        slug: '',
        description: '',
      });
      setSlugEdited(false);
    }
  }, [initialData, isOpen]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'main_title') {
      setFormData(prev => ({
        ...prev,
        main_title: value,
        // Solo auto-generar el slug si el usuario no lo ha editado manualmente
        slug: slugEdited ? prev.slug : generateSlug(value),
      }));
    } else if (name === 'slug') {
      setSlugEdited(true);
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-lg w-full border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
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
            {/* Título Principal */}
            <div>
              <label htmlFor="main_title" className="block text-sm font-medium text-gray-300 mb-2">
                Título Principal <span className="text-red-400">*</span>
              </label>
              <input
                id="main_title"
                name="main_title"
                type="text"
                required
                value={formData.main_title}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ej: Kevin Ponce - Developer"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL única) <span className="text-red-400">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={formData.slug}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="ej: kevin-ponce-developer"
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.slug ? (
                  <>
                    Tu perfil estará disponible en:{' '}
                    <span className="text-orange-400 font-medium">
                      {window.location.origin}/{formData.slug}
                    </span>
                  </>
                ) : (
                  'El slug se generará automáticamente desde el título'
                )}
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Descripción <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                disabled={loading}
                rows={4}
                className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Describe tu perfil... Ej: Desarrollador Full Stack especializado en React y Node.js"
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.description.length} caracteres
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
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>{initialData ? 'Actualizar' : 'Crear'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
