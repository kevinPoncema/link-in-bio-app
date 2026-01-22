import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileRequest from '../api/ProfileRequest';
import LinkRequest from '../api/LinkRequest';
import DynamicIcon from '../components/DynamicIcon';
import ThemeProvider, { useThemeColors } from '../components/ThemeProvider';
import Watermark from '../components/Watermark';
import { Loader2, User, ExternalLink, AlertCircle } from 'lucide-react';
import { getFullImageUrl } from '../utils/imageHelpers';

function PublicProfile() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      loadProfileData();
    }
  }, [slug]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar perfil por slug
      const profileData = await ProfileRequest.getProfileById(slug);
      console.log('Profile data:', profileData);
      setProfile(profileData);

      // Cargar links del perfil
      const linksData = await LinkRequest.getLinksByProfile(profileData.id);
      console.log('Links data received:', linksData);
      
      // La respuesta puede ser un array directo o estar en data
      const linksArray = Array.isArray(linksData) ? linksData : (linksData.data || []);
      console.log('Links array:', linksArray);
      
      // Filtrar solo links activos y ordenar
      const activeLinks = linksArray
        .filter(link => link.is_active !== false) // Mostrar todos excepto los explícitamente inactivos
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(link => ({
          ...link,
          // Limpiar las barras invertidas de las URLs
          url: link.url.replace(/\\/g, '')
        }));
      
      console.log('Active links:', activeLinks);
      setLinks(activeLinks);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message || 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (url) => {
    // Limpiar URL de barras invertidas si quedaron
    const cleanUrl = url.replace(/\\/g, '');
    window.open(cleanUrl, '_blank', 'noopener,noreferrer');
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

  // Componente interno con acceso a los colores del tema
  const ProfileContent = () => {
    const themeColors = useThemeColors(profile.theme_id);

    return (
      <div className="py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          {/* Profile Header */}
          <div 
            className="bg-gray-800/80 backdrop-blur-md rounded-2xl lg:rounded-2xl p-5 sm:p-6 lg:p-8 mb-4 lg:mb-5 border text-center shadow-2xl"
            style={{ borderColor: `${themeColors.primary}40` }}
          >
            {/* Profile Picture */}
            <div className="mb-4 lg:mb-5">
              {profile.profile_picture_url ? (
                <img
                  src={getFullImageUrl(profile.profile_picture_url)}
                  alt={profile.main_title}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full mx-auto object-cover border-4 shadow-xl"
                  style={{ borderColor: themeColors.primary }}
                />
              ) : (
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full mx-auto flex items-center justify-center shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                  }}
                >
                  <User className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 lg:mb-3 break-words">
              {profile.main_title}
            </h1>
            
            {profile.description && (
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-3 break-words max-w-3xl mx-auto">
                {profile.description}
              </p>
            )}
          </div>

          {/* Links Section */}
          <div className="space-y-3 lg:space-y-3">
            {links.length === 0 ? (
              <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 lg:p-10 text-center border border-gray-700">
                <ExternalLink className="w-12 h-12 lg:w-16 lg:h-16 mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-base lg:text-lg">
                  No hay links disponibles aún
                </p>
              </div>
            ) : (
              links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.url)}
                  className="w-full bg-gray-800/80 backdrop-blur-md hover:bg-gray-700/80 border rounded-2xl p-4 lg:p-5 transition-all duration-300 group transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{ 
                    borderColor: 'transparent',
                    '--hover-border': themeColors.primary 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = themeColors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                      }}
                    >
                      <DynamicIcon
                        iconName={link.icon_class}
                        className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
                      />
                    </div>

                    {/* Link Info */}
                    <div className="flex-1 text-left min-w-0">
                      <h3 
                        className="text-white font-semibold text-base sm:text-lg lg:text-xl mb-1 truncate group-hover:transition-colors"
                        style={{ '--hover-color': themeColors.primary }}
                        onMouseEnter={(e) => e.currentTarget.style.color = themeColors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                      >
                        {link.title}
                      </h3>
                      <p className="text-gray-400 text-xs lg:text-sm truncate flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                        {link.url.replace(/^https?:\/\//, '').replace(/\\/g, '')}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0">
                      <ExternalLink 
                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400 transition-colors"
                        style={{ '--hover-color': themeColors.primary }}
                        onMouseEnter={(e) => e.currentTarget.style.color = themeColors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}
                      />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 lg:mt-10 text-center">
            {/* Marca de agua - Solo para usuarios no premium */}
            <Watermark profile={profile} themeId={profile.theme_id} />
            
            <p className="text-gray-400 text-xs lg:text-sm">
              Creado con{' '}
              <a
                href="/"
                className="font-semibold transition-colors"
                style={{ color: themeColors.primary }}
                onMouseEnter={(e) => e.currentTarget.style.color = themeColors.secondary}
                onMouseLeave={(e) => e.currentTarget.style.color = themeColors.primary}
              >
                Link in Bio App
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ThemeProvider themeId={profile.theme_id}>
      <ProfileContent />
    </ThemeProvider>
  );
}

export default PublicProfile;
