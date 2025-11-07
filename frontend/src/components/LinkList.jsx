import React, { useEffect, useState } from 'react';
import LinkRequest from '../api/LinkRequest';
import { 
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';

const LinkList = ({ profileId, themeName = 'default', onLinksChange }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (profileId) {
      loadLinks();
    }
  }, [profileId]);

  const loadLinks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await LinkRequest.getLinksByProfile(profileId);
      // Ordenar links por el campo 'order'
      const sortedLinks = (data.data || data).sort((a, b) => (a.order || 0) - (b.order || 0));
      setLinks(sortedLinks);
      
      // Notificar al padre si hay callback
      if (onLinksChange) {
        onLinksChange(sortedLinks);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los links');
      console.error('Error al cargar links:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!confirm('¿Estás seguro de eliminar este link?')) return;

    try {
      setError('');
      setSuccess('');
      await LinkRequest.deleteLink(linkId);
      setSuccess('Link eliminado exitosamente');
      
      // Recargar la lista de links
      loadLinks();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al eliminar el link');
      console.error('Error al eliminar link:', err);
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleEditLink = (link) => {
    // TODO: Implementar modal de edición
    console.log('Editar link:', link);
    alert('La edición de links estará disponible próximamente');
  };

  const handleAddLink = () => {
    // TODO: Implementar modal de creación
    console.log('Agregar nuevo link');
    alert('La creación de links estará disponible próximamente');
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          <span className="ml-3 text-gray-400">Cargando links...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Links del Perfil</h2>
          <p className="text-sm text-gray-400 mt-1">
            Gestiona y ordena tus enlaces
          </p>
          {themeName && themeName !== 'default' && (
            <p className="text-xs text-orange-400 mt-1">
              Tema actual: {themeName}
            </p>
          )}
        </div>
        <button
          onClick={handleAddLink}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-4 py-2 rounded-xl font-semibold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Link</span>
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="flex items-center space-x-2 bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-4">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded-xl mb-4">
          <CheckCircle className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {/* Lista de Links */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="text-center py-12">
            <LinkIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              No hay links aún
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Agrega tu primer link para comenzar
            </p>
            <button
              onClick={handleAddLink}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Primer Link</span>
            </button>
          </div>
        ) : (
          links.map((link, index) => (
            <div
              key={link.id}
              className="flex items-center space-x-3 bg-gray-700 p-4 rounded-xl border border-gray-600 hover:border-orange-500 transition-all group"
            >
              {/* Drag Handle */}
              <div className="flex-shrink-0 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-gray-500" />
              </div>

              {/* Order Number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-300">
                  {link.order || index + 1}
                </span>
              </div>

              {/* Link Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-white truncate">
                    {link.title}
                  </h4>
                  {link.icon_class && (
                    <span className="text-xs text-gray-500">
                      {link.icon_class}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-orange-400 truncate transition-colors"
                  >
                    {link.url}
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditLink(link)}
                  className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Editar link"
                >
                  <Edit2 className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Eliminar link"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info de ordenamiento */}
      {links.length > 0 && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-xs text-blue-300">
            💡 <span className="font-semibold">Próximamente:</span> Podrás reordenar los links arrastrando y soltando
          </p>
        </div>
      )}
    </div>
  );
};

export default LinkList;
