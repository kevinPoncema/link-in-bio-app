import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileRequest from '../api/ProfileRequest';
import LinkRequest from '../api/LinkRequest';
import DynamicIcon from '../components/DynamicIcon';
import { Loader2, User, ExternalLink, AlertCircle } from 'lucide-react';

function PublicProfile() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfileData();
  }, [slug]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar perfil por slug
      const profileData = await ProfileRequest.getProfileById(slug);
      setProfile(profileData);

      // Cargar links del perfil
      const linksData = await LinkRequest.getLinksByProfile(profileData.id);
      // Filtrar solo links activos y ordenar
      const activeLinks = (linksData.data || linksData)
        .filter(link => link.is_active)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setLinks(activeLinks);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message || 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Perfil no encontrado</h2>
          <p className="text-gray-400 mb-6">
            {error || 'El perfil que buscas no existe o ha sido eliminado'}
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-6 border border-gray-700 text-center">
          {/* Profile Picture */}
          <div className="mb-6">
            {profile.profile_picture_url ? (
              <img
                src={profile.profile_picture_url}
                alt={profile.main_title}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto object-cover border-4 border-gradient-to-r from-pink-500 to-orange-500"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 break-words">
            {profile.main_title}
          </h1>
          
          {profile.description && (
            <p className="text-gray-300 text-base sm:text-lg mb-4 break-words">
              {profile.description}
            </p>
          )}

          {/* Theme Badge (opcional) */}
          {profile.theme_name && profile.theme_name !== 'default' && (
            <div className="inline-flex items-center px-4 py-2 bg-gray-700 rounded-full text-sm text-gray-300">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Tema: {profile.theme_name}
            </div>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
              <ExternalLink className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                No hay links disponibles aún
              </p>
            </div>
          ) : (
            links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.url)}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 rounded-2xl p-5 transition-all duration-300 group transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DynamicIcon
                      iconName={link.icon_class}
                      className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                    />
                  </div>

                  {/* Link Info */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-white font-semibold text-lg sm:text-xl mb-1 truncate group-hover:text-orange-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate flex items-center">
                      <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                      {link.url.replace(/^https?:\/\//, '')}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0">
                    <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Creado con{' '}
            <a
              href="/"
              className="text-orange-500 hover:text-orange-400 font-semibold transition-colors"
            >
              Link in Bio App
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;
