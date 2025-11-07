import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileRequest from '../api/ProfileRequest';
import { Plus, Edit, Trash2, Loader2, CheckCircle, XCircle, User } from 'lucide-react';

function ProfilesPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    main_title: '',
    slug: '',
    description: '',
  });

  // Cargar perfiles al montar el componente
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ProfileRequest.getAllProfiles();
      setProfiles(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('sesión')) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Auto-generar slug desde el título
    if (name === 'main_title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingProfile) {
        // Actualizar perfil existente
        await ProfileRequest.updateProfile(editingProfile.id, formData);
        setSuccess('Perfil actualizado exitosamente');
      } else {
        // Crear nuevo perfil
        await ProfileRequest.createProfile(formData);
        setSuccess('Perfil creado exitosamente');
      }
      
      // Recargar lista y cerrar modal
      await loadProfiles();
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (profile) => {
    setEditingProfile(profile);
    setFormData({
      main_title: profile.main_title,
      slug: profile.slug,
      description: profile.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (profileId) => {
    if (!confirm('¿Estás seguro de eliminar este perfil?')) return;

    try {
      setError('');
      await ProfileRequest.deleteProfile(profileId);
      setSuccess('Perfil eliminado exitosamente');
      await loadProfiles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      main_title: '',
      slug: '',
      description: '',
    });
    setEditingProfile(null);
    setError('');
    setSuccess('');
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
              Mis Perfiles
            </h1>
            <p className="text-gray-400 mt-2">Gestiona tus perfiles de Link in Bio</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Perfil</span>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center space-x-2 bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl mb-6">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Profiles List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
            <User className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tienes perfiles aún</h3>
            <p className="text-gray-400 mb-6">Crea tu primer perfil para comenzar</p>
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl transition-all"
            >
              Crear Primer Perfil
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-orange-500 transition-all"
              >
                <h3 className="text-xl font-bold mb-2 text-orange-400">
                  {profile.main_title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  <span className="text-gray-500">Slug:</span> {profile.slug}
                </p>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {profile.description}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">
                {editingProfile ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Título */}
                <div>
                  <label htmlFor="main_title" className="block text-sm font-medium text-gray-300 mb-1">
                    Título Principal
                  </label>
                  <input
                    id="main_title"
                    name="main_title"
                    type="text"
                    required
                    value={formData.main_title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Ej: Kevin Ponce"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
                    Slug (URL única)
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="ej: kevin-ponce-dev"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: {window.location.origin}/{formData.slug}
                  </p>
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Describe tu perfil..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-xl transition-all"
                  >
                    {editingProfile ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilesPage;
