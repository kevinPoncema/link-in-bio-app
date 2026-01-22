import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthRequest from '../api/AuthRequest';
import ProfileRequest from '../api/ProfileRequest';
import ThemeSelector from '../components/ThemeSelector';
import ThemeProvider, { useThemeColors } from '../components/ThemeProvider';
import LinkList from '../components/LinkList';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Camera,
  User,
  Upload,
  X as XIcon
} from 'lucide-react';
import { getFullImageUrl, validateImageFile, fileToBase64 } from '../utils/imageHelpers';

function ProfileEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estado para los datos del formulario de perfil
  const [formData, setFormData] = useState({
    main_title: '',
    slug: '',
    description: '',
    theme_id: 1,
    profile_picture: '',
  });
  const [slugEdited, setSlugEdited] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Verificar si hay sesión activa
    if (!AuthRequest.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Cargar datos del perfil
    loadProfile();
  }, [id, navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ProfileRequest.getProfileById(id);
      const profileData = data.data || data;
      setProfile(profileData);
      
      // Cargar datos en el formulario
      setFormData({
        main_title: profileData.main_title || '',
        slug: profileData.slug || '',
        description: profileData.description || '',
        theme_id: profileData.theme_id || 1,
        profile_picture: profileData.profile_picture_url || '',
      });
      // Usar el helper para obtener la URL completa
      setImagePreview(getFullImageUrl(profileData.profile_picture_url));
      setImageChanged(false); // Reset al cargar
      setSlugEdited(true);
      
    } catch (err) {
      setError(err.message || 'Error al cargar el perfil');
      console.error('Error al cargar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'main_title') {
      setFormData(prev => ({
        ...prev,
        main_title: value,
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

  const handleThemeChange = (themeName) => {
    setFormData(prev => ({
      ...prev,
      theme_id: themeName,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar la imagen
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      // Convertir a base64
      const base64String = await fileToBase64(file);
      setImagePreview(base64String);
      setImageChanged(true); // Marcar que la imagen fue modificada
      setFormData(prev => ({
        ...prev,
        profile_picture: base64String,
      }));
    } catch (err) {
      setError('Error al procesar la imagen');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageChanged(true); // Marcar que la imagen fue modificada (removida)
    setFormData(prev => ({
      ...prev,
      profile_picture: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Preparar los datos para enviar
      const dataToSend = {
        main_title: formData.main_title,
        slug: formData.slug,
        description: formData.description,
        theme_id: formData.theme_id,
      };
      
      // Solo incluir profile_picture si fue modificada
      if (imageChanged) {
        dataToSend.profile_picture = formData.profile_picture;
      }
      
      await ProfileRequest.updateProfile(id, dataToSend);
      
      setSuccess('¡Perfil actualizado exitosamente!');
      // Recargar datos del perfil
      loadProfile();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
      console.error('Error al actualizar perfil:', err);
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700 text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <nav className="bg-gray-800 border-b border-gray-700 p-3 sm:p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <button
              onClick={handleBack}
              className="flex items-center space-x-1 sm:space-x-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm">Volver</span>
            </button>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent truncate">
              Editar Perfil
            </h1>
          </div>
          {/* Botón Guardar */}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-3 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex-shrink-0"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="hidden sm:inline">Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content con Theme Provider */}
      <ThemeProvider themeId={formData.theme_id}>
        <main className="container mx-auto p-4 sm:p-6 md:p-8 max-w-5xl">
          {/* Mensajes */}
          {error && (
            <div className="flex items-center space-x-2 bg-red-900 border border-red-700 text-red-300 px-3 py-2 sm:px-4 sm:py-3 rounded-xl mb-4 sm:mb-6 text-sm">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 bg-green-900 border border-green-700 text-green-300 px-3 py-2 sm:px-4 sm:py-3 rounded-xl mb-4 sm:mb-6 text-sm">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Columna Izquierda - Información del Perfil */}
            <div className="lg:col-span-1">
              <ProfileFormSection 
                profile={profile}
                formData={formData}
                slugEdited={slugEdited}
                saving={saving}
                imagePreview={imagePreview}
                fileInputRef={fileInputRef}
                onInputChange={handleInputChange}
                onThemeChange={handleThemeChange}
                onSaveProfile={handleSaveProfile}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
                onImageClick={handleImageClick}
              />
            </div>

            {/* Columna Derecha - Gestión de Links */}
            <div className="lg:col-span-2">
              <LinkList 
                profileId={id} 
                themeId={formData.theme_id}
                onLinksChange={(links) => {
                  console.log('Links actualizados:', links.length);
                }}
              />
            </div>
          </div>
        </main>
      </ThemeProvider>
    </div>
  );
}

// Componente separado para el formulario de perfil
const ProfileFormSection = ({ 
  profile, 
  formData, 
  slugEdited, 
  saving,
  imagePreview,
  fileInputRef,
  onInputChange, 
  onThemeChange, 
  onSaveProfile,
  onImageChange,
  onRemoveImage,
  onImageClick
}) => {
  const themeColors = useThemeColors(formData.theme_id);

  return (
    <div 
      className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border sticky top-24 shadow-xl"
      style={{ borderColor: `${themeColors.primary}40` }}
    >
      <h2 className="text-xl font-bold mb-6">Información del Perfil</h2>
      
      {/* Imagen de Perfil */}
      <div className="flex flex-col items-center mb-6">
        <div 
          className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group border-4 transition-all"
          style={{ borderColor: themeColors.primary }}
          onClick={onImageClick}
        >
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                <Camera className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
              }}
            >
              <div className="text-center">
                <User className="w-12 h-12 text-white mx-auto mb-2" />
                <Upload className="w-6 h-6 text-white mx-auto opacity-70" />
              </div>
            </div>
          )}
        </div>

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
          disabled={saving}
        />

        {/* Botones de imagen */}
        <div className="flex space-x-2 mt-4">
          <button
            type="button"
            onClick={onImageClick}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
              color: 'white'
            }}
          >
            {imagePreview ? 'Cambiar' : 'Subir Foto'}
          </button>
          {imagePreview && (
            <button
              type="button"
              onClick={onRemoveImage}
              disabled={saving}
              className="px-4 py-2 bg-gray-700/80 hover:bg-gray-600/80 text-white text-sm rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {/* Formulario de Perfil */}
      <form onSubmit={onSaveProfile} className="space-y-4">
        {/* Título */}
        <div>
          <label htmlFor="main_title" className="block text-sm font-medium text-gray-300 mb-2">
            Título Principal
          </label>
          <input
            id="main_title"
            name="main_title"
            type="text"
            required
            value={formData.main_title}
            onChange={onInputChange}
            className="w-full px-4 py-2 border bg-gray-700/80 backdrop-blur-md text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              borderColor: `${themeColors.primary}40`,
              '--tw-ring-color': themeColors.primary 
            }}
            placeholder="Ej: Kevin Ponce"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={formData.slug}
            onChange={onInputChange}
            className="w-full px-4 py-2 border bg-gray-700/80 backdrop-blur-md text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2"
            style={{ 
              borderColor: `${themeColors.primary}40`,
              '--tw-ring-color': themeColors.primary 
            }}
            placeholder="ej: kevin-ponce"
          />
          <p className="text-xs text-gray-500 mt-1 truncate">
            /{formData.slug}
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={onInputChange}
            rows={4}
            className="w-full px-4 py-2 border bg-gray-700/80 backdrop-blur-md text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 resize-none"
            style={{ 
              borderColor: `${themeColors.primary}40`,
              '--tw-ring-color': themeColors.primary 
            }}
            placeholder="Describe tu perfil..."
          />
        </div>

        {/* Información adicional */}
        <div className="pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 space-y-1">
            <p><span className="font-semibold">Tema:</span> {profile?.theme?.name || `ID ${profile?.theme_id || 1}`}</p>
            <p><span className="font-semibold">Creado:</span> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</p>
          </div>
        </div>

        {/* Selector de Temas */}
        <div className="pt-4 border-t border-gray-700">
          <ThemeSelector
            selectedTheme={formData.theme_id}
            onThemeChange={onThemeChange}
            disabled={saving}
          />
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
