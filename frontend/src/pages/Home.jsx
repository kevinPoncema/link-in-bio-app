import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthRequest from '../api/AuthRequest';
import ProfileRequest from '../api/ProfileRequest';
import ProfileCard from '../components/ProfileCard';
import ProfileForm from '../components/ProfileForm';
import { LogOut, User, Plus, Loader2, CheckCircle } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Verificar si hay sesión activa
    if (!AuthRequest.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Obtener datos del usuario
    const userData = AuthRequest.getCurrentUser();
    setUser(userData);

    // Obtener perfiles del usuario
    loadProfiles();
  }, [navigate]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ProfileRequest.getAllProfiles();
      setProfiles(data.data || data);
    } catch (err) {
      setError(err.message || 'Error al cargar los perfiles');
      console.error('Error al cargar perfiles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthRequest.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Redirigir de todas formas
      navigate('/login');
    }
  };

  const handleDeleteProfile = async (profileId) => {
    try {
      await ProfileRequest.deleteProfile(profileId);
      setSuccess('Perfil eliminado exitosamente');
      // Recargar la lista de perfiles
      loadProfiles();
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al eliminar el perfil');
      console.error('Error al eliminar perfil:', err);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCreateProfile = () => {
    setShowModal(true);
    setFormError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError('');
  };

  const handleSubmitProfile = async (formData) => {
    try {
      setFormLoading(true);
      setFormError('');
      await ProfileRequest.createProfile(formData);
      setSuccess('¡Perfil creado exitosamente!');
      setShowModal(false);
      // Recargar la lista de perfiles
      loadProfiles();
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Error al crear el perfil');
      console.error('Error al crear perfil:', err);
    } finally {
      setFormLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Link in Bio
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-8">
        {/* Sección de Perfiles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Mis Perfiles</h2>
              <p className="text-gray-400">
                Gestiona tus perfiles de Link in Bio
              </p>
            </div>
            <button
              onClick={handleCreateProfile}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Perfil</span>
            </button>
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Mensajes de éxito */}
          {success && (
            <div className="flex items-center space-x-2 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl mb-6">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          {/* Estado de carga */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <span className="ml-3 text-gray-400">Cargando perfiles...</span>
            </div>
          ) : profiles.length === 0 ? (
            /* Sin perfiles */
            <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <User className="w-16 h-16 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-400">
                  No tienes perfiles aún
                </h3>
                <p className="text-gray-500 max-w-md">
                  Crea tu primer perfil para comenzar a compartir tus enlaces con el mundo
                </p>
                <button
                  onClick={handleCreateProfile}
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg mt-4"
                >
                  <Plus className="w-5 h-5" />
                  <span>Crear mi primer perfil</span>
                </button>
              </div>
            </div>
          ) : (
            /* Lista de perfiles */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onDelete={handleDeleteProfile}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Creación de Perfil */}
      <ProfileForm
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProfile}
        loading={formLoading}
        error={formError}
      />
    </div>
  );
}

export default Home;
