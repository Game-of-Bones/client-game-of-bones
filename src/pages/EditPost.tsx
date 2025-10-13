// Página para editar un post existente (ruta de administrador)

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// TODO: Importar servicios cuando estén disponibles
// import { getPostById, updatePost } from '../services/postService';

/**
 * EditPost - Página para editar un post existente
 * 
 * Funcionalidad:
 * - Cargar datos del post existente
 * - Formulario pre-rellenado con los datos actuales
 * - Guardar cambios
 * - Preview de cambios
 * - Historial de versiones (opcional)
 */
const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Estado para control de carga y errores
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  /**
   * Cargar el post al montar el componente
   */
  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  /**
   * Obtener datos del post a editar
   */
  const fetchPost = async () => {
    setIsLoading(true);

    try {
      // TODO: Implementar cuando el servicio esté listo
      // const response = await getPostById(id);
      // setFormData({
      //   title: response.title,
      //   content: response.content
      // });

      // MOCK temporal - ELIMINAR cuando el servicio esté listo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPost = {
        id: id,
        title: 'El destino de los reinos',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`.trim()
      };

      setFormData({
        title: mockPost.title,
        content: mockPost.content
      });

    } catch (err: any) {
      setErrors({ general: 'Error al cargar el post' });
      console.error('Error fetching post:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres';
    } else if (formData.title.length > 200) {
      newErrors.title = 'El título no puede tener más de 200 caracteres';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    } else if (formData.content.length < 20) {
      newErrors.content = 'El contenido debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Guarda los cambios del post
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implementar cuando el servicio esté listo
      // await updatePost(id, formData);

      // MOCK temporal - ELIMINAR cuando el servicio esté listo
      console.log('Updating post:', id, formData);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: Mostrar notificación de éxito
      // toast.success('Post actualizado correctamente');

      // Redirigir al post actualizado
      navigate(`/posts/${id}`);

    } catch (err: any) {
      // Manejar errores
      if (err.response?.status === 400) {
        setErrors(err.response.data.errors || { general: 'Datos inválidos' });
      } else if (err.response?.status === 404) {
        setErrors({ general: 'Post no encontrado' });
      } else if (err.response?.status === 403) {
        setErrors({ general: 'No tienes permisos para editar este post' });
      } else {
        setErrors({ general: 'Error al actualizar el post' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Post</h1>
        
        {/* Toggle Preview */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          {showPreview ? 'Editar' : 'Vista Previa'}
        </button>
      </div>

      {/* Error general */}
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errors.general}
        </div>
      )}

      {showPreview ? (
        /* MODO PREVIEW */
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-4xl font-bold mb-4">{formData.title}</h2>
          <div className="prose max-w-none">
            {formData.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph || <br />}
              </p>
            ))}
          </div>
        </div>
      ) : (
        /* MODO EDICIÓN */
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            {/* Campo Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Título del Post *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Un título épico para tu historia..."
                className={`w-full px-4 py-3 text-2xl border rounded focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/200 caracteres
              </p>
            </div>

            {/* Campo Contenido */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                Contenido *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                placeholder="Escribe tu historia aquí..."
                className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 font-mono ${
                  errors.content
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.content.length} caracteres
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/posts/${id}`)}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Advertencia de cambios sin guardar */}
      {/* TODO: Implementar detección de cambios sin guardar
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg">
          Tienes cambios sin guardar
        </div>
      )}
      */}
    </div>
  );
};

export default EditPost;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Servicio de actualización (src/services/postService.ts):
 *    export const updatePost = async (id: string, data: {
 *      title: string;
 *      content: string;
 *    }) => {
 *      const response = await fetch(`http://localhost:3000/posts/${id}`, {
 *        method: 'PUT',
 *        headers: {
 *          'Content-Type': 'application/json',
 *          'Authorization': `Bearer ${localStorage.getItem('token')}`
 *        },
 *        body: JSON.stringify(data)
 *      });
 *      
 *      if (!response.ok) throw new Error('Update failed');
 *      return await response.json();
 *    };
 * 
 * 2. Detectar cambios sin guardar:
 *    - Comparar formData con los datos originales
 *    - Mostrar advertencia al intentar salir de la página
 *    - Usar beforeunload event del navegador:
 *    
 *    useEffect(() => {
 *      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
 *        if (hasUnsavedChanges) {
 *          e.preventDefault();
 *          e.returnValue = '';
 *        }
 *      };
 *      window.addEventListener('beforeunload', handleBeforeUnload);
 *      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
 *    }, [hasUnsavedChanges]);
 * 
 * 3. Historial de versiones:
 *    - Guardar cada edición como una versión
 *    - Botón "Ver historial" que muestra versiones anteriores
 *    - Opción de restaurar versión anterior
 *    - Diff visual entre versiones (qué cambió)
 * 
 * 4. Auto-guardar cambios:
 *    - Guardar automáticamente cada X segundos
 *    - Indicador visual "Guardando..." / "Todos los cambios guardados"
 *    - Usar debounce para no guardar en cada tecla
 * 
 * 5. Validación de permisos:
 *    - Verificar en el backend que el usuario puede editar
 *    - Solo el autor o admin pueden editar
 *    - Mostrar mensaje apropiado si no tiene permisos
 * 
 * 6. Editor colaborativo en tiempo real:
 *    - Usar WebSockets para edición simultánea
 *    - Mostrar cursor de otros usuarios editando
 *    - Conflict resolution si múltiples personas editan
 *    - Librerías: Y.js, ShareDB, Operational Transform
 * 
 * 7. Metadatos de edición:
 *    - Mostrar quién editó por última vez y cuándo
 *    - Mostrar número total de ediciones
 *    - Log de cambios (audit trail)
 * 
 * 8. Despublicar post:
 *    - Botón para cambiar status de published a draft
 *    - Útil si se encuentra un error después de publicar
 *    - Solo admin puede despublicar posts de otros
 */