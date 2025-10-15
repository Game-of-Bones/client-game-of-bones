import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { usePostStore } from '../stores/postStore';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { Camera, Upload, Link as LinkIcon } from 'lucide-react';

type FossilType = 'bones_teeth' | 'shell_exoskeletons' | 'plant_impressions' | 'tracks_traces' | 'amber_insects';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const user = useAuthStore((state) => state.user);
  const { currentPost, isLoading, error, fetchPostById, updatePost } = usePostStore();

  const [formData, setFormData] = useState<{
    title: string;
    summary: string;
    image_url: string;
    discovery_date: string;
    location: string;
    paleontologist: string;
    fossil_type: FossilType;
    geological_period: string;
    source: string;
  }>({
    title: '',
    summary: '',
    image_url: '',
    discovery_date: '',
    location: '',
    paleontologist: '',
    fossil_type: 'bones_teeth',
    geological_period: '',
    source: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file' | 'camera'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fossilTypes = [
    { value: 'bones_teeth', label: 'Huesos y Dientes' },
    { value: 'shell_exoskeletons', label: 'Conchas y Exoesqueletos' },
    { value: 'plant_impressions', label: 'Impresiones de Plantas' },
    { value: 'tracks_traces', label: 'Huellas y Rastros' },
    { value: 'amber_insects', label: 'Insectos en Ámbar' }
  ];

  useEffect(() => {
    if (id) {
      fetchPostById(parseInt(id));
    }
  }, [id, fetchPostById]);

  useEffect(() => {
    if (currentPost) {
      setFormData({
        title: currentPost.title || '',
        summary: currentPost.summary || '',
        image_url: currentPost.image_url || '',
        discovery_date: currentPost.discovery_date || '',
        location: currentPost.location || '',
        paleontologist: currentPost.paleontologist || '',
        fossil_type: (currentPost.fossil_type as FossilType) || 'bones_teeth',
        geological_period: currentPost.geological_period || '',
        source: currentPost.source || ''
      });
    }
  }, [currentPost]);

  // Limpiar stream de cámara al desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejar subida desde archivo local
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setServerError('');
    } catch (error: any) {
      setServerError(error.message || 'Error al subir la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Iniciar cámara
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setServerError('No se pudo acceder a la cámara');
    }
  };

  // Capturar foto desde cámara
  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      setIsUploadingImage(true);
      try {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        const imageUrl = await uploadToCloudinary(file);
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        
        // Detener cámara
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        setUploadMethod('url');
      } catch (error: any) {
        setServerError(error.message || 'Error al subir la imagen');
      } finally {
        setIsUploadingImage(false);
      }
    }, 'image/jpeg', 0.9);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    } else if (formData.title.length > 255) {
      newErrors.title = 'El título no puede tener más de 255 caracteres';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'El resumen es obligatorio';
    }

    if (!formData.fossil_type) {
      newErrors.fossil_type = 'Debes seleccionar un tipo de fósil';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePost(parseInt(id!), formData);
      navigate(`/posts/${id}`);
    } catch (err: any) {
      setServerError(err.message || 'Error al actualizar el descubrimiento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AA7B5C] mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Cargando descubrimiento...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container-custom section-padding">
        <div className="card text-center" style={{ backgroundColor: 'var(--color-danger)', color: 'white' }}>
          <p className="text-lg font-semibold">No tienes permisos para editar descubrimientos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'Cinzel, serif', color: 'var(--text-primary)' }}>
          Editar Descubrimiento
        </h1>
      </div>

      {/* Error general */}
      {(serverError || error) && (
        <div className="card mb-6" style={{ backgroundColor: '#FEE2E2', borderColor: 'var(--color-danger)' }}>
          <p style={{ color: 'var(--color-danger)' }}>{serverError || error}</p>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="card space-y-6">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Título del Descubrimiento *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título del descubrimiento"
              disabled={isSubmitting}
              className="input"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                borderColor: errors.title ? 'var(--color-danger)' : 'var(--border-color)'
              }}
            />
            {errors.title && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.title}</p>
            )}
          </div>

          {/* Resumen */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Resumen *
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Descripción detallada del descubrimiento"
              rows={6}
              disabled={isSubmitting}
              className="input"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                borderColor: errors.summary ? 'var(--color-danger)' : 'var(--border-color)',
                resize: 'vertical'
              }}
            />
            {errors.summary && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.summary}</p>
            )}
          </div>

          {/* Tipo de Fósil y Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fossil_type" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Tipo de Fósil *
              </label>
              <select
                id="fossil_type"
                name="fossil_type"
                value={formData.fossil_type}
                onChange={handleChange}
                disabled={isSubmitting}
                className="input"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {fossilTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="geological_period" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Período Geológico
              </label>
              <input
                type="text"
                id="geological_period"
                name="geological_period"
                value={formData.geological_period}
                onChange={handleChange}
                placeholder="Ej: Cretácico Superior"
                disabled={isSubmitting}
                className="input"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              />
            </div>
          </div>

          {/* Fecha y Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="discovery_date" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Fecha de Descubrimiento
              </label>
              <input
                type="date"
                id="discovery_date"
                name="discovery_date"
                value={formData.discovery_date}
                onChange={handleChange}
                disabled={isSubmitting}
                className="input"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej: Montana, USA"
                disabled={isSubmitting}
                className="input"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              />
            </div>
          </div>

          {/* Paleontólogo */}
          <div>
            <label htmlFor="paleontologist" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Paleontólogo
            </label>
            <input
              type="text"
              id="paleontologist"
              name="paleontologist"
              value={formData.paleontologist}
              onChange={handleChange}
              placeholder="Nombre del paleontólogo"
              disabled={isSubmitting}
              className="input"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)'
              }}
            />
          </div>

          {/* Imagen con múltiples opciones */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Imagen del Descubrimiento
            </label>

            {/* Botones de método */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('url');
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  uploadMethod === 'url' 
                    ? 'bg-[#AA7B5C] text-white border-[#AA7B5C]' 
                    : 'bg-transparent border-[var(--border-color)]'
                }`}
                style={{ color: uploadMethod === 'url' ? 'white' : 'var(--text-primary)' }}
              >
                <LinkIcon size={18} />
                URL
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadMethod('file');
                  fileInputRef.current?.click();
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  uploadMethod === 'file' 
                    ? 'bg-[#AA7B5C] text-white border-[#AA7B5C]' 
                    : 'bg-transparent border-[var(--border-color)]'
                }`}
                style={{ color: uploadMethod === 'file' ? 'white' : 'var(--text-primary)' }}
                disabled={isUploadingImage}
              >
                <Upload size={18} />
                Subir Archivo
              </button>

              <button
                type="button"
                onClick={() => {
                  setUploadMethod('camera');
                  startCamera();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  uploadMethod === 'camera' 
                    ? 'bg-[#AA7B5C] text-white border-[#AA7B5C]' 
                    : 'bg-transparent border-[var(--border-color)]'
                }`}
                style={{ color: uploadMethod === 'camera' ? 'white' : 'var(--text-primary)' }}
                disabled={isUploadingImage}
              >
                <Camera size={18} />
                Cámara
              </button>
            </div>

            {/* Input oculto para archivos */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Campo URL */}
            {uploadMethod === 'url' && (
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={isSubmitting}
                className="input"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              />
            )}

            {/* Vista previa de cámara */}
            {uploadMethod === 'camera' && stream && (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="btn btn-primary w-full"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? 'Subiendo...' : 'Capturar Foto'}
                </button>
              </div>
            )}

            {/* Estado de carga */}
            {isUploadingImage && (
              <div className="mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#AA7B5C] mx-auto mb-2"></div>
                Subiendo imagen...
              </div>
            )}

            {/* Vista previa */}
            {formData.image_url && !stream && (
              <div className="mt-4">
                <img
                  src={formData.image_url}
                  alt="Vista previa"
                  className="w-full rounded-lg"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          {/* Fuente */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Fuente
            </label>
            <input
              type="url"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="https://enlace-a-articulo-cientifico.com"
              disabled={isSubmitting}
              className="input"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)'
              }}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            disabled={isSubmitting}
            className="btn btn-secondary flex-1"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isUploadingImage}
            className="btn btn-primary flex-1"
          >
            {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;