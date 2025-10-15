// src/components/forms/EditPostForm.tsx
import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore'; 
import { usePostStore } from '../../stores/postStore'; 
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'; 
import { Upload, Link, Save, MapPin } from 'lucide-react';
import Input from '../ui/Input';
import { FOSSIL_TYPE_OPTIONS } from '../../types/post.types';
import type { Post, FossilType } from '../../types/post.types';

type FormData = {
    title: string;
    post_content: string;
    summary: string; 
    image_url: string;
    paleontologist: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    fossil_type: string;
    geological_period: string;
    discovery_date: string;
    source: string;
    status: 'draft' | 'published';
};

interface EditPostFormProps {
    postId: string;
    initialData: Post;
}

const EditPostForm: React.FC<EditPostFormProps> = ({ postId, initialData }) => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user); 
    const updatePost = usePostStore((state) => state.updatePost);
    const isSubmitting = usePostStore((state) => state.isLoading);
    const postError = usePostStore((state) => state.error);
    
    const [formData, setFormData] = useState<FormData>({
        title: initialData.title || '',
        post_content: initialData.post_content || '',
        summary: initialData.summary || '', 
        image_url: initialData.image_url || '',
        paleontologist: initialData.paleontologist || '',
        location: initialData.location || '',
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null,
        fossil_type: initialData.fossil_type || FOSSIL_TYPE_OPTIONS[0].value, 
        geological_period: initialData.geological_period || '',
        discovery_date: initialData.discovery_date ? new Date(initialData.discovery_date).toISOString().split('T')[0] : '',
        source: initialData.source || '',
        status: initialData.status || 'draft'
    });

    useEffect(() => {
        setFormData({
            title: initialData.title || '',
            post_content: initialData.post_content || '', 
            summary: initialData.summary || '', 
            image_url: initialData.image_url || '',
            paleontologist: initialData.paleontologist || '',
            location: initialData.location || '',
            latitude: initialData.latitude || null,
            longitude: initialData.longitude || null,
            fossil_type: initialData.fossil_type || FOSSIL_TYPE_OPTIONS[0].value, 
            geological_period: initialData.geological_period || '',
            discovery_date: initialData.discovery_date ? new Date(initialData.discovery_date).toISOString().split('T')[0] : '',
            source: initialData.source || '',
            status: initialData.status || 'draft'
        });
    }, [initialData]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isGeolocating, setIsGeolocating] = useState(false);
    const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file'); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        setServerError('');

        try {
            const imageUrl = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, image_url: imageUrl }));
        } catch (error: any) {
            console.error('Error uploading image:', error);
            setServerError(error.message || 'Error al subir la imagen a Cloudinary');
        } finally {
            setIsUploadingImage(false);
            e.target.value = ''; 
        }
    };

    const handleGeolocate = async () => {
        const location = formData.location.trim();
        if (!location) {
            setServerError('Por favor, introduce una ubicación antes de geocodificar.');
            return;
        }

        setIsGeolocating(true);
        setServerError('');

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
                {
                    headers: {
                        'User-Agent': 'PaleontologApp/1.0'
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Error al conectar con el servicio de geocodificación');
            }

            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setFormData(prev => ({
                    ...prev,
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lon)
                }));
                setServerError('');
            } else {
                setServerError('No se encontraron coordenadas para esa ubicación. Intenta ser más específico.');
            }
        } catch (error: any) {
            console.error('Geocoding error:', error);
            setServerError(error.message || 'Error al obtener las coordenadas de la ubicación');
        } finally {
            setIsGeolocating(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'El Título del Post es obligatorio.';
        if (!formData.summary.trim()) newErrors.summary = 'El Subtítulo/Resumen es obligatorio.';
        if (!formData.post_content.trim()) newErrors.post_content = 'El Contenido Detallado es obligatorio.';
        if (!formData.fossil_type) newErrors.fossil_type = 'Debes seleccionar el Tipo de Fósil.';
        
        if (!formData.image_url && !isUploadingImage) newErrors.image_url = 'Debes incluir una imagen principal.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent, statusOverride: 'draft' | 'published') => {
        e.preventDefault();
        setServerError('');
    
        if (!validateForm()) {
            setServerError('POR FAVOR, RELLENE TODOS LOS CAMPOS OBLIGATORIOS.');
            return;
        }
    
        if (isSubmitting || isUploadingImage) return;
    
        try {
            const dataToSubmit = {
                title: formData.title,
                summary: formData.summary, 
                post_content: formData.post_content,
                image_url: formData.image_url,
                paleontologist: formData.paleontologist || undefined,
                location: formData.location || undefined,
                latitude: formData.latitude,
                longitude: formData.longitude,
                // ⬇️ AÑADE "as FossilType" para el type assertion
                fossil_type: formData.fossil_type as FossilType,
                geological_period: formData.geological_period || undefined,
                discovery_date: formData.discovery_date ? new Date(formData.discovery_date).toISOString() : undefined,
                source: formData.source || undefined,
                status: statusOverride,
            };
    
            await updatePost(Number(postId), dataToSubmit);
            
            const redirectPath = statusOverride === 'published' ? `/posts/${postId}` : '/profile';
            navigate(redirectPath);
    
        } catch (err: any) {
            setServerError(postError || err.message || 'Error al actualizar el post.'); 
        }
    };

    return (
        <div className="container-custom mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-cinzel tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    Editar Descubrimiento
                </h1>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Modificando: {initialData.title}
                </p>
            </div>

            {(serverError || postError) && (
                <div className="p-4 mb-6 rounded-lg text-center" style={{ backgroundColor: 'var(--bg-danger-light)', color: 'var(--color-danger)' }}>
                    {serverError || postError}
                </div>
            )}
            
            <p className="text-sm italic mb-6 text-center" style={{ color: 'var(--color-danger)' }}>
                * Campos obligatorios
            </p>

            <div className="space-y-6">
                
                <Input
                    id="title"
                    name="title"
                    type="text"
                    label="TÍTULO DEL POST *"
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    placeholder="Escribe el título principal..."
                    disabled={isSubmitting}
                    required
                    inputClass="text-xl font-bold tracking-wider" 
                />

                <Input
                    id="summary"
                    name="summary" 
                    type="text"
                    label="SUBTÍTULO DEL POST *"
                    value={formData.summary}
                    onChange={handleChange}
                    error={errors.summary}
                    placeholder="Un breve resumen o eslogan..."
                    disabled={isSubmitting}
                    required
                />
                
                <div className="p-6 rounded-lg relative" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color-dark)' }}>
                    
                    <div className="flex gap-2 mb-4 justify-center">
                        <button
                            type="button"
                            onClick={() => setUploadMethod('url')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                uploadMethod === 'url' ? 'btn-primary-small' : 'btn-secondary-small' 
                            }`}
                        >
                            <Link size={18} /> URL
                        </button>
                        <button 
                            type="button" 
                            onClick={() => { setUploadMethod('file'); fileInputRef.current?.click(); }} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                uploadMethod === 'file' ? 'btn-primary-small' : 'btn-secondary-small' 
                            }`}
                        >
                            <Upload size={18} /> Subir Archivo
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </div>

                    {uploadMethod === 'url' && (
                        <Input 
                            id="image_url" 
                            name="image_url" 
                            type="url" 
                            label="URL de la Imagen"
                            labelHidden
                            value={formData.image_url} 
                            onChange={handleChange} 
                            placeholder="Pega la URL de la imagen principal aquí..." 
                            disabled={isSubmitting || isUploadingImage} 
                        />
                    )}

                    {isUploadingImage ? (
                        <div className="text-center p-8 text-lg font-bold" style={{ color: 'var(--color-accent)' }}>Subiendo imagen...</div>
                    ) : formData.image_url ? (
                        <div className="mt-4 border-2 rounded-lg overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                            <img src={formData.image_url} alt="Vista previa del descubrimiento" className="w-full" style={{ maxHeight: '350px', objectFit: 'cover' }} />
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col justify-center items-center rounded-lg p-10" style={{ backgroundColor: 'var(--bg-input-hover)', height: '280px' }}>
                            <img
                                src="/Triceratops_Skull_in_Earthy_Brown.png"
                                alt="Cráneo de Triceratops de marcador de posición"
                                className="opacity-80"
                                style={{ width: '180px', height: '180px', objectFit: 'contain' }}
                            />
                            {errors.image_url && <p className="mt-2 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.image_url}</p>}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        id="paleontologist"
                        name="paleontologist"
                        type="text"
                        label="PALEONTÓLOGO DESCUBRIDOR"
                        value={formData.paleontologist}
                        onChange={handleChange}
                        placeholder="Nombre y apellido"
                        disabled={isSubmitting}
                    />
                    <Input
                        id="geological_period"
                        name="geological_period"
                        type="text"
                        label="PERÍODO GEOLÓGICO"
                        value={formData.geological_period}
                        onChange={handleChange}
                        placeholder="Ej: Cretácico Superior"
                        disabled={isSubmitting}
                    />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                        LUGAR DEL DESCUBRIMIENTO
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Ej: Patagonia, Argentina"
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 rounded-md transition"
                                style={{
                                    backgroundColor: 'var(--bg-input)',
                                    color: 'var(--text-primary)',
                                    borderColor: 'var(--border-color)',
                                    borderWidth: '1px'
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleGeolocate}
                            disabled={isGeolocating || isSubmitting || !formData.location}
                            className="btn btn-secondary-outline flex items-center gap-2 whitespace-nowrap"
                        >
                            <MapPin size={18} />
                            {isGeolocating ? 'Buscando...' : 'Obtener Coordenadas'}
                        </button>
                    </div>
                    {formData.latitude && formData.longitude && (
                        <p className="mt-2 text-xs" style={{ color: 'var(--color-success)' }}>
                            ✓ Coordenadas: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                        </p>
                    )}
                </div>

                <Input
                    id="discovery_date"
                    name="discovery_date"
                    type="date"
                    label="FECHA DE DESCUBRIMIENTO"
                    value={formData.discovery_date}
                    onChange={handleChange}
                    disabled={isSubmitting}
                />
                
                <div>
                    <label htmlFor="fossil_type" className="block text-sm font-medium mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                        TIPO DE FÓSIL *
                    </label>
                    <select
                        id="fossil_type"
                        name="fossil_type"
                        value={formData.fossil_type}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="input-select w-full px-4 py-3 rounded-md transition"
                        style={{
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            borderColor: errors.fossil_type ? 'var(--color-danger)' : 'var(--border-color)',
                        }}
                    >
                        {FOSSIL_TYPE_OPTIONS.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {errors.fossil_type && (
                        <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.fossil_type}</p>
                    )}
                </div>
                
                <div>
                    <label htmlFor="post_content" className="block text-sm font-medium mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                        CONTENIDO DEL POST (Detallado) *
                    </label>
                    <textarea
                        id="post_content"
                        name="post_content" 
                        value={formData.post_content}
                        onChange={handleChange}
                        placeholder="Escribe la descripción detallada, métodos de excavación, importancia del hallazgo, etc..."
                        rows={8}
                        disabled={isSubmitting}
                        className="input-textarea w-full p-4 rounded-md transition"
                        style={{
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            borderColor: errors.post_content ? 'var(--color-danger)' : 'var(--border-color)',
                            resize: 'vertical'
                        }}
                    />
                    {errors.post_content && (
                        <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.post_content}</p>
                    )}
                </div>

                <Input
                    id="source"
                    name="source"
                    type="url"
                    label="FUENTE (Enlace de referencia)"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="https://doi.org/referencia-cientifica"
                    disabled={isSubmitting}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        id="author"
                        name="author"
                        type="text"
                        label="AUTOR DEL POST"
                        value={user?.username || 'Cargando Usuario...'}
                        disabled
                        placeholder=""
                    />

                    <div>
                        <label className="block text-sm font-medium mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                            ESTATUS DEL POST
                        </label>
                        <div className="flex gap-6 p-3 rounded" style={{ backgroundColor: 'var(--bg-input)' }}>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={formData.status === 'draft'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-4 h-4 cursor-pointer"
                                    style={{ accentColor: '#AA7B5C' }}
                                />
                                <span style={{ color: 'var(--text-primary)' }}>Borrador</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="published"
                                    checked={formData.status === 'published'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-4 h-4 cursor-pointer"
                                    style={{ accentColor: '#AA7B5C' }}
                                />
                                <span style={{ color: 'var(--text-primary)' }}>Publicado</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                        className="btn btn-secondary-outline" 
                    >
                        Cancelar
                    </button>
                    
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={isSubmitting || isUploadingImage}
                        className="btn btn-tertiary" 
                    >
                        <Save size={18} className="mr-2" />
                        {isSubmitting ? 'Guardando...' : 'Guardar Borrador'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'published')}
                        disabled={isSubmitting || isUploadingImage}
                        className="btn btn-primary"
                    >
                        {isSubmitting ? 'Actualizando...' : 'Actualizar Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPostForm;