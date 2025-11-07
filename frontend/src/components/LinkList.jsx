import React, { useEffect, useState } from 'react';
import LinkRequest from '../api/LinkRequest';
import LinkCreate from './LinkCreate';
import { 
  Plus,
  GripVertical,
  Edit2,
  Trash2,
  Loader2,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle,
  XCircle,
  Save,
  Hash
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente para items arrastrables
const SortableLink = ({ link, index, onEdit, onDelete, deletingId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-700 rounded-xl border ${
        isDragging ? 'border-orange-500 shadow-lg' : 'border-gray-600'
      } hover:border-gray-500 transition-all`}
    >
      <div className="p-4 flex items-center space-x-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Order Badge - Icono genérico */}
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Hash className="w-4 h-4 text-white" />
        </div>

        {/* Link Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-white font-semibold truncate">
              {link.title}
            </h4>
            {link.icon_class && (
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
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
            onClick={() => onEdit(link)}
            disabled={deletingId === link.id}
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Editar link"
          >
            <Edit2 className="w-4 h-4 text-blue-400" />
          </button>
          <button
            onClick={() => onDelete(link.id)}
            disabled={deletingId === link.id}
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eliminar link"
          >
            {deletingId === link.id ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            ) : (
              <Trash2 className="w-4 h-4 text-red-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const LinkList = ({ profileId, themeName = 'default', onLinksChange }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editingLink, setEditingLink] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Función para calcular el siguiente orden disponible
  const getNextOrder = () => {
    if (links.length === 0) return 1;
    const maxOrder = Math.max(...links.map(link => link.order || 0));
    return maxOrder + 1;
  };

  // Manejar el evento de drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = links.findIndex(link => link.id === active.id);
    const newIndex = links.findIndex(link => link.id === over.id);

    // Reordenar localmente sin recargar
    const newLinks = arrayMove(links, oldIndex, newIndex);
    
    // Actualizar los valores de order
    const updatedLinks = newLinks.map((link, index) => ({
      ...link,
      order: index + 1
    }));
    
    setLinks(updatedLinks);
    setHasUnsavedChanges(true);

    if (onLinksChange) {
      onLinksChange(updatedLinks);
    }
  };

  // Guardar el orden manualmente
  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      setError('');
      
      // Preparar datos asegurando que se incluyan todos los campos necesarios
      const updatedLinks = links.map((link, index) => ({
        id: link.id,
        order: index + 1,
        title: link.title,
        url: link.url,
        icon_class: link.icon_class || null,
        is_active: link.is_active
      }));

      await LinkRequest.updateLinksOrder(updatedLinks);
      
      setSuccess('¡Orden guardado exitosamente!');
      setHasUnsavedChanges(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al guardar el orden');
      console.error('Error al guardar orden:', err);
      setTimeout(() => setError(''), 5000);
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este link?')) {
      return;
    }

    try {
      setDeletingId(linkId);
      await LinkRequest.deleteLink(linkId);
      
      setSuccess('¡Link eliminado exitosamente!');
      loadLinks();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al eliminar el link');
      console.error('Error al eliminar link:', err);
      setTimeout(() => setError(''), 5000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setShowCreateModal(true);
    setCreateError('');
  };

  const handleAddLink = () => {
    setEditingLink(null);
    setShowCreateModal(true);
    setCreateError('');
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingLink(null);
    setCreateError('');
  };

  const handleCreateLink = async (linkData) => {
    try {
      setCreateLoading(true);
      setCreateError('');
      
      if (editingLink) {
        // Actualizar link existente
        await LinkRequest.updateLink(linkData.id, linkData);
        setSuccess('¡Link actualizado exitosamente!');
      } else {
        // Crear nuevo link con orden automático
        const newLinkData = {
          ...linkData,
          order: getNextOrder() // Calcular el siguiente orden
        };
        await LinkRequest.createLink(newLinkData);
        setSuccess('¡Link creado exitosamente!');
      }
      
      setShowCreateModal(false);
      setEditingLink(null);
      
      // Recargar la lista de links
      loadLinks();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setCreateError(err.message || `Error al ${editingLink ? 'actualizar' : 'crear'} el link`);
      console.error('Error:', err);
    } finally {
      setCreateLoading(false);
    }
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
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Guardar Orden</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={handleAddLink}
            className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-4 py-2 rounded-xl font-semibold transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Link</span>
          </button>
        </div>
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
          <>
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 bg-yellow-900/20 border border-yellow-700/30 text-yellow-300 px-4 py-3 rounded-xl mb-4">
                <XCircle className="w-5 h-5" />
                <span>Tienes cambios sin guardar. Haz clic en "Guardar Orden" para aplicar los cambios.</span>
              </div>
            )}
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={links.map(link => link.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {links.map((link, index) => (
                    <SortableLink
                      key={link.id}
                      link={link}
                      index={index}
                      onEdit={handleEditLink}
                      onDelete={handleDeleteLink}
                      deletingId={deletingId}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}
      </div>

      {/* Modal de Creación/Edición */}
      <LinkCreate
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateLink}
        profileId={profileId}
        loading={createLoading}
        error={createError}
        editingLink={editingLink}
      />
    </div>
  );
};

export default LinkList;
