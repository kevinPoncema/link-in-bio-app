import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileRequest from '../api/ProfileRequest';
import LinkRequest from '../api/LinkRequest';
import DynamicIcon from '../components/DynamicIcon';
import ThemeProvider, { useThemeColors } from '../components/ThemeProvider';
import Watermark from '../components/Watermark';
import { Loader2, User, ExternalLink, AlertCircle } from 'lucide-react';

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
    const themeColors = useThemeColors(profile.theme_name);

    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div 
            className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 mb-6 border text-center shadow-2xl"
            style={{ borderColor: `${themeColors.primary}40` }}
          >
            {/* Profile Picture */}
            <div className="mb-6">
              {profile.profile_picture_url ? (
                <img
                  src={profile.profile_picture_url}
                  alt={profile.main_title}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto object-cover border-4 shadow-xl"
                  style={{ borderColor: themeColors.primary }}
                />
              ) : (
                <div 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto flex items-center justify-center shadow-xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                  }}
                >
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
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-12 text-center border border-gray-700">
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
                  className="w-full bg-gray-800/80 backdrop-blur-md hover:bg-gray-700/80 border rounded-2xl p-5 transition-all duration-300 group transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  style={{ 
                    borderColor: 'transparent',
                    '--hover-border': themeColors.primary 
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = themeColors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` 
                      }}
                    >
                      <DynamicIcon
                        iconName={link.icon_class}
                        className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                      />
                    </div>

                    {/* Link Info */}
                    <div className="flex-1 text-left min-w-0">
                      <h3 
                        className="text-white font-semibold text-lg sm:text-xl mb-1 truncate group-hover:transition-colors"
                        style={{ '--hover-color': themeColors.primary }}
                        onMouseEnter={(e) => e.currentTarget.style.color = themeColors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                      >
                        {link.title}
                      </h3>
                      <p className="text-gray-400 text-sm truncate flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                        {link.url.replace(/^https?:\/\//, '').replace(/\\/g, '')}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="flex-shrink-0">
                      <ExternalLink 
                        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 transition-colors"
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
          <div className="mt-12 text-center">
            {/* Marca de agua - Solo para usuarios no premium */}
            <Watermark profile={profile} themeName={profile.theme_name} />
            
            <p className="text-gray-400 text-sm">
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
    <ThemeProvider themeName={profile.theme_name}>
      <ProfileContent />
    </ThemeProvider>
  );
}

export default PublicProfile;
