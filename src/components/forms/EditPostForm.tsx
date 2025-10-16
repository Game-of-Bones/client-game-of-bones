import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore'; 
import { usePostStore } from '../../stores/postStore'; 
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'; 
import { Upload, Link, Save, MapPin } from 'lucide-react';
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

    // Estilos inline basados en Figma
    const labelStyle = {
        color: '#C0B39A',
        fontFamily: 'Cinzel, serif',
        fontSize: '11px',
        fontWeight: '400',
        letterSpacing: '0.5px',
        textTransform: 'uppercase' as const,
        marginBottom: '8px'
    };

    const inputStyle = {
        backgroundColor: '#F5E6CC',
        color: '#2D1F13',
        border: '1px solid #C0B39A',
        borderRadius: '6px',
        padding: '12px 16px',
        fontFamily: 'Playfair Display, serif',
        fontSize: '15px',
        width: '100%',
        transition: 'all 0.2s'
    };

    const buttonPrimaryStyle = {
        backgroundColor: '#6DA49C',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '6px',
        padding: '12px 24px',
        fontFamily: 'Cinzel, serif',
        fontSize: '13px',
        fontWeight: '500',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    };

    const buttonSecondaryStyle = {
        backgroundColor: 'transparent',
        color: '#C0B39A',
        border: '1px solid #C0B39A',
        borderRadius: '6px',
        padding: '12px 24px',
        fontFamily: 'Cinzel, serif',
        fontSize: '13px',
        fontWeight: '500',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ 
                    fontFamily: 'Cinzel, serif', 
                    fontSize: '32px', 
                    fontWeight: '600',
                    color: '#C0B39A',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                }}>
                    Editar Descubrimiento
                </h1>
                <p style={{ 
                    fontSize: '14px', 
                    color: '#8B6543',
                    fontFamily: 'Playfair Display, serif'
                }}>
                    Modificando: {initialData.title}
                </p>
            </div>

            {(serverError || postError) && (
                <div style={{ 
                    backgroundColor: 'rgba(220, 38, 38, 0.1)', 
                    color: '#dc2626', 
                    padding: '16px', 
                    borderRadius: '6px',
                    marginBottom: '24px',
                    textAlign: 'center',
                    fontFamily: 'Playfair Display, serif'
                }}>
                    {serverError || postError}
                </div>
            )}
            
            <p style={{ 
                fontSize: '13px', 
                fontStyle: 'italic', 
                marginBottom: '24px', 
                textAlign: 'center',
                color: '#F76C5E',
                fontFamily: 'Playfair Display, serif'
            }}>
                * Campos obligatorios
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Título */}
                <div>
                    <label htmlFor="title" style={labelStyle}>Título del Post *</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Escribe el título principal..."
                        disabled={isSubmitting}
                        style={{
                            ...inputStyle,
                            fontSize: '18px',
                            fontWeight: '600',
                            borderColor: errors.title ? '#dc2626' : '#C0B39A'
                        }}
                    />
                    {errors.title && (
                        <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.title}</p>
                    )}
                </div>

                {/* Subtítulo */}
                <div>
                    <label htmlFor="summary" style={labelStyle}>Subtítulo del Post *</label>
                    <input
                        id="summary"
                        name="summary"
                        type="text"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="Un breve resumen o eslogan..."
                        disabled={isSubmitting}
                        style={{
                            ...inputStyle,
                            borderColor: errors.summary ? '#dc2626' : '#C0B39A'
                        }}
                    />
                    {errors.summary && (
                        <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.summary}</p>
                    )}
                </div>
                
                {/* Imagen */}
                <div style={{ 
                    backgroundColor: 'rgba(245, 230, 204, 0.3)', 
                    padding: '24px', 
                    borderRadius: '6px',
                    border: '1px solid rgba(192, 179, 154, 0.3)'
                }}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', justifyContent: 'center' }}>
                        <button
                            type="button"
                            onClick={() => setUploadMethod('url')}
                            style={uploadMethod === 'url' ? buttonPrimaryStyle : buttonSecondaryStyle}
                        >
                            <Link size={16} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                            URL
                        </button>
                        <button 
                            type="button" 
                            onClick={() => { setUploadMethod('file'); fileInputRef.current?.click(); }} 
                            style={uploadMethod === 'file' ? buttonPrimaryStyle : buttonSecondaryStyle}
                        >
                            <Upload size={16} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                            Subir Archivo
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </div>

                    {uploadMethod === 'url' && (
                        <input
                            id="image_url"
                            name="image_url"
                            type="url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="Pega la URL de la imagen principal aquí..."
                            disabled={isSubmitting || isUploadingImage}
                            style={inputStyle}
                        />
                    )}

                    {isUploadingImage ? (
                        <div style={{ textAlign: 'center', padding: '32px', fontSize: '16px', fontWeight: '600', color: '#D4A574' }}>
                            Subiendo imagen...
                        </div>
                    ) : formData.image_url ? (
                        <div style={{ marginTop: '16px', borderRadius: '6px', overflow: 'hidden', border: '2px solid #C0B39A' }}>
                            <img src={formData.image_url} alt="Vista previa del descubrimiento" style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} />
                        </div>
                    ) : (
                        <div style={{ 
                            marginTop: '16px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            backgroundColor: '#F5E6CC',
                            borderRadius: '6px',
                            padding: '40px',
                            height: '280px',
                            border: '2px dashed #C0B39A'
                        }}>
                            <img
                                src="/Triceratops_Skull_in_Earthy_Brown.png"
                                alt="Cráneo de Triceratops de marcador de posición"
                                style={{ width: '180px', height: '180px', objectFit: 'contain', opacity: 0.4 }}
                            />
                            {errors.image_url && (
                                <p style={{ marginTop: '8px', fontSize: '12px', color: '#dc2626' }}>{errors.image_url}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Paleontólogo y Período Geológico */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label htmlFor="paleontologist" style={labelStyle}>Paleontólogo Descubridor</label>
                        <input
                            id="paleontologist"
                            name="paleontologist"
                            type="text"
                            value={formData.paleontologist}
                            onChange={handleChange}
                            placeholder="Nombre y apellido"
                            disabled={isSubmitting}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label htmlFor="geological_period" style={labelStyle}>Período Geológico</label>
                        <input
                            id="geological_period"
                            name="geological_period"
                            type="text"
                            value={formData.geological_period}
                            onChange={handleChange}
                            placeholder="Ej: Cretácico Superior"
                            disabled={isSubmitting}
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Lugar del Descubrimiento */}
                <div>
                    <label htmlFor="location" style={labelStyle}>Lugar del Descubrimiento</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Ej: Patagonia, Argentina"
                            disabled={isSubmitting}
                            style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                            type="button"
                            onClick={handleGeolocate}
                            disabled={isGeolocating || isSubmitting || !formData.location}
                            style={{
                                ...buttonSecondaryStyle,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap',
                                opacity: (isGeolocating || isSubmitting || !formData.location) ? 0.5 : 1
                            }}
                        >
                            <MapPin size={16} />
                            {isGeolocating ? 'Buscando...' : 'Obtener Coordenadas'}
                        </button>
                    </div>
                    {formData.latitude !== null && formData.longitude !== null && (
                        <p style={{ marginTop: '8px', fontSize: '11px', color: '#6DA49C', fontWeight: '500' }}>
                            ✓ Coordenadas: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                        </p>
                    )}
                </div>

                {/* Fecha de Descubrimiento */}
                <div>
                    <label htmlFor="discovery_date" style={labelStyle}>Fecha de Descubrimiento</label>
                    <input
                        id="discovery_date"
                        name="discovery_date"
                        type="date"
                        value={formData.discovery_date}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        style={inputStyle}
                    />
                </div>
                
                {/* Tipo de Fósil */}
                <div>
                    <label htmlFor="fossil_type" style={labelStyle}>Tipo de Fósil *</label>
                    <select
                        id="fossil_type"
                        name="fossil_type"
                        value={formData.fossil_type}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        style={{
                            ...inputStyle,
                            borderColor: errors.fossil_type ? '#dc2626' : '#C0B39A'
                        }}
                    >
                        {FOSSIL_TYPE_OPTIONS.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {errors.fossil_type && (
                        <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.fossil_type}</p>
                    )}
                </div>
                
                {/* Contenido del Post */}
                <div>
                    <label htmlFor="post_content" style={labelStyle}>Contenido del Post (Detallado) *</label>
                    <textarea
                        id="post_content"
                        name="post_content"
                        value={formData.post_content}
                        onChange={handleChange}
                        placeholder="Escribe la descripción detallada, métodos de excavación, importancia del hallazgo, etc..."
                        rows={8}
                        disabled={isSubmitting}
                        style={{
                            ...inputStyle,
                            resize: 'vertical' as const,
                            borderColor: errors.post_content ? '#dc2626' : '#C0B39A'
                        }}
                    />
                    {errors.post_content && (
                        <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.post_content}</p>
                    )}
                </div>

                {/* Fuente */}
                <div>
                    <label htmlFor="source" style={labelStyle}>Fuente (Enlace de referencia)</label>
                    <input
                        id="source"
                        name="source"
                        type="url"
                        value={formData.source}
                        onChange={handleChange}
                        placeholder="https://doi.org/referencia-cientifica"
                        disabled={isSubmitting}
                        style={inputStyle}
                    />
                </div>

                {/* Autor y Estatus */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label htmlFor="author" style={labelStyle}>Autor del Post</label>
                        <input
                            id="author"
                            name="author"
                            type="text"
                            value={user?.username || 'Cargando Usuario...'}
                            disabled
                            style={{ ...inputStyle, opacity: 0.6 }}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Estatus del Post</label>
                        <div style={{ 
                            display: 'flex', 
                            gap: '24px', 
                            padding: '12px 16px', 
                            backgroundColor: '#F5E6CC',
                            borderRadius: '6px',
                            border: '1px solid #C0B39A'
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={formData.status === 'draft'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6DA49C' }}
                                />
                                <span style={{ color: '#2D1F13', fontFamily: 'Playfair Display, serif', fontSize: '15px' }}>
                                    Borrador
                                </span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="status"
                                    value="published"
                                    checked={formData.status === 'published'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6DA49C' }}
                                />
                                <span style={{ color: '#2D1F13', fontFamily: 'Playfair Display, serif', fontSize: '15px' }}>
                                    Publicado
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div style={{ paddingTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                        style={buttonSecondaryStyle}
                    >
                        Cancelar
                    </button>
                    
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'draft')}
                        disabled={isSubmitting || isUploadingImage}
                        style={{ 
                            ...buttonPrimaryStyle, 
                            backgroundColor: '#D4A574',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            opacity: (isSubmitting || isUploadingImage) ? 0.5 : 1 
                        }}
                    >
                        <Save size={16} />
                        {isSubmitting ? 'Guardando...' : 'Guardar Borrador'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, 'published')}
                        disabled={isSubmitting || isUploadingImage}
                        style={{ ...buttonPrimaryStyle, opacity: (isSubmitting || isUploadingImage) ? 0.5 : 1 }}
                    >
                        {isSubmitting ? 'Actualizando...' : 'Actualizar Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPostForm;