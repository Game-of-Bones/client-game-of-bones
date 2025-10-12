// src/pages/CreatePost.tsx
// Página para crear un nuevo post (ruta de administrador)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// TODO: Importar servicios cuando estén disponibles
// import { createPost } from '../services/postService';

/**
 * CreatePost - Página para crear un nuevo post
 * 
 * Funcionalidad:
 * - Formulario con título y contenido
 * - Validación de campos
 * - Preview del post antes de publicar
 * - Guardar como borrador o publicar
 * - Editor de texto enriquecido (opcional)
 * - Subir imágenes (opcional)
 * - Tags/categorías (opcional)
 */
const CreatePost = () => {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Estado para preview
  const [showPreview, setShowPreview] = useState(false);

  // Estado para errores y loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
   * Maneja la publicación del post
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implementar cuando el servicio esté listo
      // const response = await createPost(formData);
      // const postId = response.id;

      // MOCK temporal - ELIMINAR cuando el servicio esté listo
      console.log('Creating post:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPostId = Math.random().toString(36).substr(2, 9);

      // TODO: Mostrar notificación de éxito
      // toast.success('Post creado correctamente');

      // Redirigir al post creado
      navigate(`/posts/${mockPostId}`);

    } catch (err: any) {
      // Manejar errores
      if (err.response?.status === 400) {
        setErrors(err.response.data.errors || { general: 'Datos inválidos' });
      } else {
        setErrors({ general: 'Error al crear el post. Intenta de nuevo' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Guarda como borrador (sin publicar)
   */
  const handleSaveDraft = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implementar cuando el servicio esté listo
      // await createPost({ ...formData, status: 'draft' });

      console.log('Saving draft:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // TODO: Mostrar notificación
      // toast.success('Borrador guardado');

      navigate('/profile'); // Redirigir al perfil donde estarán los borradores

    } catch (err: any) {
      setErrors({ general: 'Error al guardar borrador' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Crear Nuevo Post</h1>
        
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
          <h2 className="text-4xl font-bold mb-4">{formData.title || 'Sin título'}</h2>
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
                placeholder="Escribe tu historia aquí...&#10;&#10;Puedes escribir múltiples párrafos separándolos con líneas en blanco."
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

            {/* TODO: Campos adicionales */}
            {/*
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags
              </label>
              <input
                type="text"
                placeholder="game-of-thrones, fantasy, epic"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Imagen de portada
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            */}
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Post'}
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition disabled:bg-gray-200"
            >
              Guardar Borrador
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePost;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Servicio de posts (src/services/postService.ts):
 *    export const createPost = async (data: {
 *      title: string;
 *      content: string;
 *      status?: 'published' | 'draft';
 *      tags?: string[];
 *      coverImage?: string;
 *    }) => {
 *      const response = await fetch('http://localhost:3000/posts', {
 *        method: 'POST',
 *        headers: {
 *          'Content-Type': 'application/json',
 *          'Authorization': `Bearer ${localStorage.getItem('token')}`
 *        },
 *        body: JSON.stringify(data)
 *      });
 *      return await response.json();
 *    };
 * 
 * 2. Editor de texto enriquecido (Rich Text Editor):
 *    Opciones de librerías:
 *    - TipTap: moderno, basado en ProseMirror, muy customizable
 *    - Quill: popular, fácil de usar
 *    - Draft.js: de Facebook, potente pero más complejo
 *    - Slate: framework para construir editores custom
 *    
 *    Características a implementar:
 *    - Negrita, cursiva, subrayado
 *    - Listas ordenadas y desordenadas
 *    - Links
 *    - Imágenes inline
 *    - Code blocks
 *    - Headers (H1, H2, H3)
 * 
 * 3. Markdown support:
 *    - Permitir escribir en Markdown
 *    - Preview renderizado en tiempo real
 *    - Usar react-markdown para renderizar
 *    - Syntax highlighting para code blocks (prism.js)
 * 
 * 4. Auto-guardar borrador:
 *    - Guardar automáticamente cada X segundos
 *    - Usar localStorage para guardar temporal
 *    - Mostrar indicador "Guardando..." / "Guardado"
 *    - Recuperar borrador si el usuario cierra la página
 * 
 * 5. Upload de imágenes:
 *    - Drag & drop para imágenes
 *    - Upload a servicio de imágenes (Cloudinary, AWS S3)
 *    - Insertar imágenes en el contenido
 *    - Imagen de portada separada del contenido
 * 
 * 6. Tags/Categorías:
 *    - Input con autocompletado de tags existentes
 *    - Crear nuevos tags on-the-fly
 *    - Limitar número de tags (máximo 5)
 *    - Validar que los tags solo tengan letras y guiones
 * 
 * 7. SEO metadata:
 *    - Meta description (resumen para SEO)
 *    - Meta keywords
 *    - Slug personalizado para la URL
 *    - Preview de cómo se vería en Google
 * 
 * 8. Validación avanzada:
 *    - Contador de palabras y tiempo de lectura estimado
 *    - Detectar posibles problemas (párrafos muy largos)
 *    - Sugerencias de mejora (agregar imágenes, dividir párrafos)
 * 
 * 9. Scheduled posts:
 *    - Opción de programar publicación para fecha futura
 *    - Selector de fecha y hora
 *    - Timezone awareness
 * 
 * 10. Colaboración:
 *     - Modo colaborativo (múltiples autores)
 *     - Sistema de revisión antes de publicar
 *     - Historial de versiones
 */