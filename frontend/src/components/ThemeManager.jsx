import React, { useState, useEffect, useRef } from 'react';
import { Palette, Plus, Trash2, Edit2, Loader2, AlertCircle, CheckCircle, Upload, X as XIcon } from 'lucide-react';
import ThemesRequest from '../api/ThemesRequest';
import { validateImageFile, fileToBase64 } from '../utils/imageHelpers';

const ThemeManager = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    primary_color: '#f97316',
    secondary_color: '#ec4899',
    background_color: '#1f2937',
    preview_url: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ThemesRequest.getAllThemes();
      setThemes(data);
    } catch (err) {
      setError(err.message || 'Error al cargar los temas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (theme = null) => {
    if (theme) {
      setEditingTheme(theme);
      setFormData({
        name: theme.name,
        primary_color: theme.primary_color,
        secondary_color: theme.secondary_color,
        background_color: theme.background_color,
        preview_url: theme.preview_url || '',
      });
      setImagePreview(theme.preview_url || null);
    } else {
      setEditingTheme(null);
      setFormData({
        name: '',
        primary_color: '#f97316',
        secondary_color: '#ec4899',
        background_color: '#1f2937',
        preview_url: '',
      });
      setImagePreview(null);
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTheme(null);
    setFormData({
      name: '',
      primary_color: '#f97316',
      secondary_color: '#ec4899',
      background_color: '#1f2937',
      preview_url: '',
    });
    setImagePreview(null);
    setError('');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      setFormData(prev => ({ ...prev, preview_url: base64 }));
      setError('');
    } catch (err) {
      setError('Error al procesar la imagen');
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, preview_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre del tema es obligatorio');
      return;
    }

    if (!ThemesRequest.isValidHexColor(formData.primary_color) ||
        !ThemesRequest.isValidHexColor(formData.secondary_color) ||
        !ThemesRequest.isValidHexColor(formData.background_color)) {
      setError('Los colores deben estar en formato hexadecimal (#RRGGBB)');
      return;
    }

    try {
      setModalLoading(true);
      setError('');

      const themeData = {
        name: formData.name.trim(),
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        background_color: formData.background_color,
        preview_url: formData.preview_url || null,
        is_custom: true,
      };

      if (editingTheme) {
        await ThemesRequest.updateTheme(editingTheme.id, themeData);
        setSuccess('Tema actualizado exitosamente');
      } else {
        await ThemesRequest.createTheme(themeData);
        setSuccess('Tema creado exitosamente');
      }

      await loadThemes();
      handleCloseModal();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al guardar el tema');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (themeId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este tema?')) return;

    try {
      setError('');
      await ThemesRequest.deleteTheme(themeId);
      setSuccess('Tema eliminado exitosamente');
      await loadThemes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al eliminar el tema');
    }
  };

  const systemThemes = themes.filter(t => !t.is_custom);
  const customThemes = themes.filter(t => t.is_custom);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
            Gestión de Temas
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Personaliza la apariencia de tus perfiles
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Crear Tema</span>
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="flex items-center gap-2 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-gray-400">Cargando temas...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Temas del Sistema */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Temas del Sistema</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} isSystem={true} />
              ))}
            </div>
          </div>

          {/* Temas Personalizados */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Mis Temas Personalizados</h3>
            {customThemes.length === 0 ? (
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
                <Palette className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No has creado temas personalizados aún</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="mt-4 text-orange-500 hover:text-orange-400 font-medium text-sm"
                >
                  Crear tu primer tema
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customThemes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isSystem={false}
                    onEdit={() => handleOpenModal(theme)}
                    onDelete={() => handleDelete(theme.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {editingTheme ? 'Editar Tema' : 'Crear Nuevo Tema'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
              {error && (
                <div className="flex items-center gap-2 bg-red-900/50 border border-red-700 text-red-300 px-3 py-2 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Tema *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  placeholder="Ej: Mi Tema Personalizado"
                  required
                />
              </div>

              {/* Imagen de Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagen de Fondo (Opcional)
                </label>
                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-600 rounded-xl p-6 hover:border-orange-500 transition-colors text-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Click para subir imagen</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 2MB)</p>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Colores */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Color Primario *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-shrink-0">
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                        className="w-full sm:w-20 h-12 rounded-xl cursor-pointer border-2 border-gray-600 hover:border-orange-500 transition-colors"
                        title="Haz click para elegir un color"
                      />
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
                        Click
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, primary_color: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Color Secundario *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-shrink-0">
                      <input
                        type="color"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                        className="w-full sm:w-20 h-12 rounded-xl cursor-pointer border-2 border-gray-600 hover:border-orange-500 transition-colors"
                        title="Haz click para elegir un color"
                      />
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
                        Click
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondary_color: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Color de Fondo *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-shrink-0">
                      <input
                        type="color"
                        value={formData.background_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                        className="w-full sm:w-20 h-12 rounded-xl cursor-pointer border-2 border-gray-600 hover:border-orange-500 transition-colors"
                        title="Haz click para elegir un color"
                      />
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full pointer-events-none">
                        Click
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.background_color}
                      onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vista Previa
                </label>
                <div
                  className="w-full h-24 rounded-xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${formData.primary_color}, ${formData.secondary_color})`,
                  }}
                >
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Background"
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                  )}
                  <div className="relative z-10 text-white font-bold text-lg">
                    {formData.name || 'Nuevo Tema'}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors text-sm"
                  disabled={modalLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>{editingTheme ? 'Actualizar' : 'Crear'} Tema</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para mostrar cada tema
const ThemeCard = ({ theme, isSystem, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all">
      {/* Preview */}
      <div className="relative h-32">
        {theme.preview_url ? (
          <img
            src={theme.preview_url}
            alt={theme.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${theme.primary_color}, ${theme.secondary_color})`,
            }}
          />
        )}
        {isSystem && (
          <div className="absolute top-2 right-2 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-md">
            <span className="text-xs text-gray-300 font-medium">Sistema</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="text-white font-semibold mb-2">{theme.name}</h4>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-600"
            style={{ backgroundColor: theme.primary_color }}
            title="Color primario"
          />
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-600"
            style={{ backgroundColor: theme.secondary_color }}
            title="Color secundario"
          />
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-600"
            style={{ backgroundColor: theme.background_color }}
            title="Color de fondo"
          />
        </div>

        {!isSystem && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-900/50 hover:bg-red-900/70 border border-red-700 text-red-300 px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeManager;
