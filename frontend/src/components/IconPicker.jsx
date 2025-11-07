import React, { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';

const IconPicker = ({ selectedIcon, onSelectIcon, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Colección de iconos organizados por categorías
  const iconCategories = useMemo(() => ({
    'Redes Sociales': {
      // Font Awesome Social
      'FaFacebook': { icon: FaIcons.FaFacebook, name: 'Facebook', color: '#1877F2' },
      'FaTwitter': { icon: FaIcons.FaTwitter, name: 'Twitter', color: '#1DA1F2' },
      'FaInstagram': { icon: FaIcons.FaInstagram, name: 'Instagram', color: '#E4405F' },
      'FaLinkedin': { icon: FaIcons.FaLinkedin, name: 'LinkedIn', color: '#0A66C2' },
      'FaYoutube': { icon: FaIcons.FaYoutube, name: 'YouTube', color: '#FF0000' },
      'FaTiktok': { icon: FaIcons.FaTiktok, name: 'TikTok', color: '#000000' },
      'FaGithub': { icon: FaIcons.FaGithub, name: 'GitHub', color: '#181717' },
      'FaWhatsapp': { icon: FaIcons.FaWhatsapp, name: 'WhatsApp', color: '#25D366' },
      'FaTelegram': { icon: FaIcons.FaTelegram, name: 'Telegram', color: '#26A5E4' },
      'FaDiscord': { icon: FaIcons.FaDiscord, name: 'Discord', color: '#5865F2' },
      'FaSlack': { icon: FaIcons.FaSlack, name: 'Slack', color: '#4A154B' },
      'FaSpotify': { icon: FaIcons.FaSpotify, name: 'Spotify', color: '#1DB954' },
      'FaTwitch': { icon: FaIcons.FaTwitch, name: 'Twitch', color: '#9146FF' },
      'FaReddit': { icon: FaIcons.FaReddit, name: 'Reddit', color: '#FF4500' },
      'FaPinterest': { icon: FaIcons.FaPinterest, name: 'Pinterest', color: '#E60023' },
      'FaSnapchat': { icon: FaIcons.FaSnapchat, name: 'Snapchat', color: '#FFFC00' },
      'FaMedium': { icon: FaIcons.FaMedium, name: 'Medium', color: '#000000' },
      'FaDribbble': { icon: FaIcons.FaDribbble, name: 'Dribbble', color: '#EA4C89' },
      'FaBehance': { icon: FaIcons.FaBehance, name: 'Behance', color: '#1769FF' },
      
      // Simple Icons (más específicos)
      'SiX': { icon: SiIcons.SiX, name: 'X (Twitter)', color: '#000000' },
      'SiThreads': { icon: SiIcons.SiThreads, name: 'Threads', color: '#000000' },
      'SiBluesky': { icon: SiIcons.SiBluesky, name: 'Bluesky', color: '#0085FF' },
      'SiMastodon': { icon: SiIcons.SiMastodon, name: 'Mastodon', color: '#6364FF' },
    },
    'Profesional': {
      'FaEnvelope': { icon: FaIcons.FaEnvelope, name: 'Email', color: '#EA4335' },
      'FaBriefcase': { icon: FaIcons.FaBriefcase, name: 'Portfolio', color: '#6B7280' },
      'FaFileAlt': { icon: FaIcons.FaFileAlt, name: 'CV/Resume', color: '#6B7280' },
      'FaGlobe': { icon: FaIcons.FaGlobe, name: 'Sitio Web', color: '#6B7280' },
      'FaUser': { icon: FaIcons.FaUser, name: 'Perfil', color: '#6B7280' },
    },
    'Contenido': {
      'FaBlog': { icon: FaIcons.FaBlog, name: 'Blog', color: '#6B7280' },
      'FaNewspaper': { icon: FaIcons.FaNewspaper, name: 'Artículos', color: '#6B7280' },
      'FaBook': { icon: FaIcons.FaBook, name: 'Ebook', color: '#6B7280' },
      'FaCamera': { icon: FaIcons.FaCamera, name: 'Fotografía', color: '#6B7280' },
      'FaVideo': { icon: FaIcons.FaVideo, name: 'Video', color: '#6B7280' },
      'FaMusic': { icon: FaIcons.FaMusic, name: 'Música', color: '#6B7280' },
      'FaPodcast': { icon: FaIcons.FaPodcast, name: 'Podcast', color: '#6B7280' },
      'FaMicrophone': { icon: FaIcons.FaMicrophone, name: 'Audio', color: '#6B7280' },
    },
    'Tienda/Servicios': {
      'FaShoppingCart': { icon: FaIcons.FaShoppingCart, name: 'Tienda', color: '#6B7280' },
      'FaStore': { icon: FaIcons.FaStore, name: 'Negocio', color: '#6B7280' },
      'FaGift': { icon: FaIcons.FaGift, name: 'Productos', color: '#6B7280' },
      'FaCreditCard': { icon: FaIcons.FaCreditCard, name: 'Pagos', color: '#6B7280' },
      'FaPaypal': { icon: FaIcons.FaPaypal, name: 'PayPal', color: '#00457C' },
      'FaDollarSign': { icon: FaIcons.FaDollarSign, name: 'Precio', color: '#10B981' },
    },
    'Otros': {
      'FaHeart': { icon: FaIcons.FaHeart, name: 'Favorito', color: '#EF4444' },
      'FaStar': { icon: FaIcons.FaStar, name: 'Destacado', color: '#FBBF24' },
      'FaCalendar': { icon: FaIcons.FaCalendar, name: 'Calendario', color: '#6B7280' },
      'FaMapMarkerAlt': { icon: FaIcons.FaMapMarkerAlt, name: 'Ubicación', color: '#EF4444' },
      'FaPhone': { icon: FaIcons.FaPhone, name: 'Teléfono', color: '#10B981' },
      'FaDownload': { icon: FaIcons.FaDownload, name: 'Descarga', color: '#6B7280' },
      'FaLink': { icon: FaIcons.FaLink, name: 'Enlace', color: '#6B7280' },
      'FaExternalLinkAlt': { icon: FaIcons.FaExternalLinkAlt, name: 'Link Externo', color: '#6B7280' },
      'FaGamepad': { icon: FaIcons.FaGamepad, name: 'Juegos', color: '#8B5CF6' },
      'FaCoffee': { icon: FaIcons.FaCoffee, name: 'Café', color: '#92400E' },
    }
  }), []);

  // Filtrar iconos según búsqueda
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) {
      return iconCategories;
    }

    const search = searchTerm.toLowerCase();
    const filtered = {};

    Object.entries(iconCategories).forEach(([category, icons]) => {
      const matchingIcons = Object.entries(icons).filter(([key, data]) =>
        data.name.toLowerCase().includes(search) ||
        key.toLowerCase().includes(search)
      );

      if (matchingIcons.length > 0) {
        filtered[category] = Object.fromEntries(matchingIcons);
      }
    });

    return filtered;
  }, [searchTerm, iconCategories]);

  const handleSelectIcon = (iconKey) => {
    onSelectIcon(iconKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-white">
              Selecciona un Icono
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Elige el icono que mejor represente tu link
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre... (ej: facebook, email, tienda)"
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Icons Grid */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {Object.keys(filteredIcons).length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No se encontraron iconos</p>
              <p className="text-sm text-gray-500 mt-2">
                Intenta con otro término de búsqueda
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(filteredIcons).map(([category, icons]) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {Object.entries(icons).map(([iconKey, iconData]) => {
                      const IconComponent = iconData.icon;
                      const isSelected = selectedIcon === iconKey;
                      
                      return (
                        <button
                          key={iconKey}
                          onClick={() => handleSelectIcon(iconKey)}
                          className={`
                            relative group flex flex-col items-center justify-center p-3 rounded-xl
                            transition-all duration-200
                            ${isSelected 
                              ? 'bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg scale-105' 
                              : 'bg-gray-700 hover:bg-gray-600 hover:scale-105'
                            }
                          `}
                          title={iconData.name}
                        >
                          <IconComponent 
                            className="w-6 h-6"
                            style={{ color: isSelected ? '#ffffff' : iconData.color }}
                          />
                          <span className="text-[9px] text-gray-300 mt-1.5 truncate w-full text-center">
                            {iconData.name}
                          </span>
                          
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {selectedIcon ? (
                <>
                  Seleccionado: <span className="text-white font-medium">{
                    Object.values(iconCategories)
                      .flatMap(cat => Object.entries(cat))
                      .find(([key]) => key === selectedIcon)?.[1]?.name || selectedIcon
                  }</span>
                </>
              ) : (
                'Selecciona un icono de la lista'
              )}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPicker;
