import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthRequest from '../api/AuthRequest';
import ProfileRequest from '../api/ProfileRequest';
import ThemeSelector from '../components/ThemeSelector';
import { 
  ArrowLeft, 
  Loader2, 
  Save, 
  User, 
  Camera, 
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Plus,
  GripVertical,
  Edit2,
  Trash2
} from 'lucide-react';

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
    theme_name: 'default',
  });
  const [slugEdited, setSlugEdited] = useState(false);

  // Estado para los links (próxima implementación)
  const [links, setLinks] = useState([]);

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
        theme_name: profileData.theme_name || 'default',
      });
      setSlugEdited(true);
      
      // TODO: Cargar links del perfil
      // const linksData = await LinkRequest.getLinksByProfile(id);
      // setLinks(linksData);
      
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
      theme_name: themeName,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await ProfileRequest.updateProfile(id, formData);
      
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
      <nav className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Editar Perfil
            </h1>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-8 max-w-5xl">
        {/* Mensajes */}
        {error && (
          <div className="flex items-center space-x-2 bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl mb-6">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda - Información del Perfil */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Información del Perfil</h2>
              
              {/* Imagen de Perfil */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  {profile?.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt={profile.main_title}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center border-4 border-gray-700">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <button
                    disabled
                    className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-500 to-orange-500 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Próximamente: Subir foto"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  La subida de imágenes estará disponible próximamente
                </p>
              </div>

              {/* Formulario de Perfil */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
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
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="Describe tu perfil..."
                  />
                </div>

                {/* Información adicional */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><span className="font-semibold">Tema:</span> {profile?.theme_name || 'default'}</p>
                    <p><span className="font-semibold">Creado:</span> {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}</p>
                  </div>
                </div>

                {/* Selector de Temas */}
                <div className="pt-4 border-t border-gray-700">
                  <ThemeSelector
                    selectedTheme={formData.theme_name}
                    onThemeChange={handleThemeChange}
                    disabled={saving}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Columna Derecha - Gestión de Links */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Links del Perfil</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Gestiona y ordena tus enlaces
                  </p>
                </div>
                <button
                  disabled
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-4 py-2 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Próximamente"
                >
                  <Plus className="w-5 h-5" />
                  <span>Agregar Link</span>
                </button>
              </div>

              {/* Lista de Links (Placeholder) */}
              <div className="space-y-3">
                {links.length === 0 ? (
                  <div className="text-center py-12">
                    <LinkIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">
                      No hay links aún
                    </h3>
                    <p className="text-sm text-gray-500">
                      La gestión de links estará disponible próximamente
                    </p>
                  </div>
                ) : (
                  links.map((link, index) => (
                    <div
                      key={link.id}
                      className="flex items-center space-x-3 bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-all"
                    >
                      <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{link.title}</h4>
                        <p className="text-sm text-gray-400 truncate">{link.url}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-blue-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfileEdit;
