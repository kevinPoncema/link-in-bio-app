import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit, Trash2, User, Share2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRModal from './QRModal';
import { getFullImageUrl } from '../utils/imageHelpers';

const ProfileCard = ({ profile, onDelete }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => {
    setShowMenu(false);
    navigate(`/profile/edit/${profile.id}`);
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(profile.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleShareProfile = () => {
    const profileURL = `${window.location.origin}/${profile.slug}`;
    
    // Intentar copiar al portapapeles
    navigator.clipboard.writeText(profileURL)
      .then(() => {
        // Mostrar feedback visual
        setShowCopyFeedback(true);
        setTimeout(() => {
          setShowCopyFeedback(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Error al copiar al portapapeles:', err);
        // Fallback: crear un input temporal
        const tempInput = document.createElement('input');
        tempInput.value = profileURL;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        setShowCopyFeedback(true);
        setTimeout(() => {
          setShowCopyFeedback(false);
        }, 2000);
      });
  };

  const handleOpenQRModal = () => {
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-orange-500 transition-all shadow-lg relative group">
        {/* Botón de menú de 3 puntos */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            aria-label="Opciones"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Menú desplegable */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-xl border border-gray-600 py-2 z-10">
              <button
                onClick={handleEdit}
                className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-600 transition-colors text-left text-white"
              >
                <Edit className="w-4 h-4 text-blue-400" />
                <span>Editar</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-600 transition-colors text-left text-white"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Borrar</span>
              </button>
            </div>
          )}
        </div>

        {/* Contenido de la tarjeta */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          {/* Imagen de perfil o placeholder */}
          <div className="flex-shrink-0">
            {profile.profile_picture_url ? (
              <img
                src={getFullImageUrl(profile.profile_picture_url)}
                alt={profile.main_title}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-orange-500"
              />
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            )}
          </div>

          {/* Información del perfil */}
          <div className="flex-1 min-w-0 pr-6 sm:pr-8">
            <h3 className="text-base sm:text-xl font-bold text-white mb-1 truncate">
              {profile.main_title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-2 line-clamp-2 text-center">
              {profile.description || 'Sin descripción'}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-4 text-xs text-gray-500 mb-3 gap-1 sm:gap-0">
              <span className="flex items-center justify-center space-x-1">
                <span className="font-semibold text-orange-400">Slug:</span>
                <span className="truncate max-w-[120px] sm:max-w-[150px]">{profile.slug}</span>
              </span>
              <span className="flex items-center justify-center space-x-1">
                <span className="font-semibold text-orange-400">Tema:</span>
                <span className="truncate">ID {profile.theme_id}</span>
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center flex-wrap gap-2 mt-3">
              {/* Botón Compartir */}
              <button
                onClick={handleShareProfile}
                className="relative flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Compartir</span>
              </button>

              {/* Botón QR */}
              <button
                onClick={handleOpenQRModal}
                className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
              >
                <QrCode className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>QR</span>
              </button>

              {/* Feedback de copiado */}
              {showCopyFeedback && (
                <div className="absolute left-0 right-0 -bottom-8 flex justify-center z-10">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-lg text-xs font-semibold shadow-lg">
                    ¡Enlace copiado!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-900/30">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              ¿Eliminar perfil?
            </h3>
            <p className="text-gray-400 text-center mb-6">
              ¿Estás seguro de que deseas eliminar el perfil <span className="font-semibold text-white">"{profile.main_title}"</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all shadow-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de QR */}
      <QRModal 
        isOpen={showQRModal}
        onClose={handleCloseQRModal}
        url={`${window.location.origin}/${profile.slug}`}
        profileName={profile.main_title}
      />
    </>
  );
};

export default ProfileCard;
