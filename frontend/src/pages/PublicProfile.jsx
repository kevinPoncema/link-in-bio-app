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
      <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          {/* Profile Header */}
          <div 
            className="bg-gray-800/80 backdrop-blur-md rounded-2xl lg:rounded-3xl p-8 sm:p-10 lg:p-12 mb-6 lg:mb-8 border text-center shadow-2xl"
            style={{ borderColor: `${themeColors.primary}40` }}
          >
            {/* Profile Picture */}
            <div className="mb-6 lg:mb-8">
              {profile.profile_picture_url ? (
                <img
                  src={getFullImageUrl(profile.profile_picture_url)}
                  alt={profile.main_title}
                  className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full mx-auto object-cover border-4 lg:border-[6px] shadow-xl"
                  style={{ borderColor: themeColors.primary }}
                />
              ) : (
                <div 
                  className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full mx-auto flex items-center justify-center shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                  }}
                >
                  <User className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 lg:mb-4 break-words">
              {profile.main_title}
            </h1>
            
            {profile.description && (
              <p className="text-gray-300 text-base sm:text-lg lg:text-xl xl:text-2xl mb-4 break-words max-w-3xl mx-auto">
                {profile.description}
              </p>
            )}
          </div>

          {/* Links Section */}
          <div className="space-y-4 lg:space-y-5">
            {links.length === 0 ? (
              <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl lg:rounded-3xl p-12 lg:p-16 text-center border border-gray-700">
                <ExternalLink className="w-16 h-16 lg:w-20 lg:h-20 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg lg:text-xl">
                  No hay links disponibles aún
                </p>
              </div>
            ) : (
              links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.url)}
                  className="w-full bg-gray-800/80 backdrop-blur-md hover:bg-gray-700/80 border rounded-2xl lg:rounded-3xl p-5 lg:p-6 xl:p-7 transition-all duration-300 group transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{ 
                    borderColor: 'transparent',
                    '--hover-border': themeColors.primary 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = themeColors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div className="flex items-center space-x-4 lg:space-x-6">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                      }}
                    >
                      <DynamicIcon
                        iconName={link.icon_class}
                        className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-white"
                      />
                    </div>

                    {/* Link Info */}
                    <div className="flex-1 text-left min-w-0">
                      <h3 
                        className="text-white font-semibold text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-1 lg:mb-2 truncate group-hover:transition-colors"
                        style={{ '--hover-color': themeColors.primary }}
                        onMouseEnter={(e) => e.currentTarget.style.color = themeColors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                      >
                        {link.title}
                      </h3>
                      <p className="text-gray-400 text-sm lg:text-base xl:text-lg truncate flex items-center">
                        <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2 flex-shrink-0" />
                        {link.url.replace(/^https?:\/\//, '').replace(/\\/g, '')}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0">
                      <ExternalLink 
                        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-400 transition-colors"
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
          <div className="mt-12 lg:mt-16 xl:mt-20 text-center">
            {/* Marca de agua - Solo para usuarios no premium */}
            <Watermark profile={profile} themeId={profile.theme_id} />
            
            <p className="text-gray-400 text-sm lg:text-base">
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
