import { useState, useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore'; 
import { usePostStore } from '../../stores/postStore'; 
import { uploadToCloudinary } from '../../utils/cloudinaryUpload'; 
import { Upload, Link as LinkIcon } from 'lucide-react';

import Input from '../ui/Input'; 

/**
 * Define los campos del formulario de creación de post
 */
type FormData = {
    title: string;
    // Campo principal del texto largo (el textarea), se envía a la API como 'content'
    full_content: string; 
    // Campo corto (SUBTÍTULO DEL POST), se envía a la API como 'summary'
    summary: string; 
    image_url: string;
    paleontologist: string;
    location: string;
    fossil_type: string; // Mantenido como string para compatibilidad con el input select
    source: string;
    status: 'draft' | 'published';
};

/**
 * Tipos de fósil para el selector
 */
const fossilTypes = [
    { value: 'bones_teeth', label: 'Huesos y Dientes' },
    { value: 'shell_exoskeletons', label: 'Conchas y Exoesqueletos' },
    { value: 'plant_impressions', label: 'Impresiones de Plantas' },
    { value: 'tracks_traces', label: 'Huellas y Rastros' },
    { value: 'amber_insects', label: 'Insectos en Ámbar' }
];

const CreatePostForm = () => {
    const navigate = useNavigate();
    
    const user = useAuthStore((state) => state.user); 
    
    // 💥 CORRECCIÓN CRÍTICA PARA EVITAR EL BUCLE INFINITO: 
    // Usamos selectores separados para evitar que se cree un nuevo objeto de dependencia 
    // en cada renderización del componente (patrón "Maximum update depth exceeded" con Zustand).
    const createPost = usePostStore((state) => state.createPost);
    const isSubmitting = usePostStore((state) => state.isLoading);
    const postError = usePostStore((state) => state.error);
    
    const [formData, setFormData] = useState<FormData>({
        title: '',
        full_content: '', 
        summary: '', 
        image_url: '',
        paleontologist: '',
        location: '',
        fossil_type: fossilTypes[0].value, 
        source: '',
        status: 'draft'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    // Mantenemos la lógica de subida de imagen, eliminando 'camera' si no se usa.
    const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file'); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    /**
     * Maneja el cambio de inputs, select y textarea.
     */
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

    /**
     * Subida de archivo (File Input) a Cloudinary
     */
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

    /**
     * Valida los campos obligatorios
     */
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = 'El Título del Post es obligatorio.';
        if (!formData.summary.trim()) newErrors.summary = 'El Subtítulo/Resumen es obligatorio.';
        if (!formData.full_content.trim()) newErrors.full_content = 'El Contenido Detallado es obligatorio.';
        if (!formData.fossil_type) newErrors.fossil_type = 'Debes seleccionar el Tipo de Fósil.';
        
        if (!formData.image_url && !isUploadingImage) newErrors.image_url = 'Debes incluir una imagen principal.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Maneja la publicación o guardado del post
     */
    const handleSubmit = async (e: React.FormEvent, statusOverride: 'draft' | 'published') => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) {
            setServerError('POR FAVOR, RELLENE TODOS LOS CAMPOS OBLIGATORIOS PARA COMPLETAR SU POST DE MANERA CORRECTA.');
            return;
        }

        if (isSubmitting || isUploadingImage) return;

        try {
            // Mapeo de campos a lo que el backend espera
            const dataToSubmit = {
                title: formData.title,
                summary: formData.summary, 
                content: formData.full_content, // Se mapea 'full_content' a 'content' de la API
                image_url: formData.image_url,
                paleontologist: formData.paleontologist,
                location: formData.location,
                fossil_type: formData.fossil_type,
                source: formData.source,
                status: statusOverride, 
                author_id: user?.id, 
            };

            const newPost = await createPost(dataToSubmit as any); 
            
            const redirectPath = statusOverride === 'published' ? `/posts/${newPost.id}` : '/profile';
            navigate(redirectPath);

        } catch (err: any) {
            // Utilizamos el estado de error directo del store si existe
            setServerError(postError || err.message || 'Error al guardar el post.'); 
        }
    };

    return (
        <div className="container-custom mx-auto px-4 py-8 max-w-5xl">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-cinzel tracking-wider" style={{ color: 'var(--color-primary)' }}>
                    Nuevo Descubrimiento
                </h1>
            </div>

            {(serverError || postError) && (
                <div className="p-4 mb-6 rounded-lg text-center" style={{ backgroundColor: 'var(--bg-danger-light)', color: 'var(--color-danger)' }}>
                    {serverError || postError}
                </div>
            )}
            
            <p className="text-sm italic mb-6 text-center" style={{ color: 'var(--color-danger)' }}>
                POR FAVOR, RELLENE TODOS LOS CAMPOS OBLIGATORIOS PARA COMPLETAR SU POST DE MANERA CORRECTA.
            </p>

            <form className="space-y-6" onSubmit={(e) => handleSubmit(e, 'published')}>
                
                {/* 1. TÍTULO DEL POST */}
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

                {/* 2. SUBTÍTULO DEL POST / RESUMEN (Campo 'summary') */}
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
                
                {/* 3. BLOQUE DE IMAGEN */}
                <div className="p-6 rounded-lg relative" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color-dark)' }}>
                    
                    <div className="flex gap-2 mb-4 justify-center">
                        <button
                            type="button"
                            onClick={() => setUploadMethod('url')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                uploadMethod === 'url' ? 'btn-primary-small' : 'btn-secondary-small' 
                            }`}
                        >
                            <LinkIcon size={18} /> URL
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

                    {/* Input URL */}
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

                    {/* Placeholder o Imagen */}
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

                {/* 4. PALEONTÓLOGO DESCUBRIDOR Y LUGAR DEL DESCUBRIMIENTO */}
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
                        id="location"
                        name="location"
                        type="text"
                        label="LUGAR DEL DESCUBRIMIENTO"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ej: Mongolia, Formación Djadochta"
                        disabled={isSubmitting}
                    />
                </div>
                
                {/* 5. TIPO DE FOSIL (SELECT) */}
                <div>
                    <label htmlFor="fossil_type" className="block text-sm font-medium mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                        TIPO DE FOSIL *
                    </label>
                    <select
                        id="fossil_type"
                        name="fossil_type"
                        value={formData.fossil_type}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className={`input-select w-full px-4 py-3 rounded-md transition ${errors.fossil_type ? 'border-danger' : 'border-primary'}`} 
                        style={{
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            borderColor: errors.fossil_type ? 'var(--color-danger)' : 'var(--border-color)',
                        }}
                    >
                        {fossilTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {errors.fossil_type && (
                        <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.fossil_type}</p>
                    )}
                </div>
                
                {/* 6. CONTENIDO DEL POST (TEXTAREA GRANDE) - full_content */}
                <div>
                    <label htmlFor="full_content" className="block text-sm font-medium mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                        CONTENIDO DEL POST (Detallado) *
                    </label>
                    <textarea
                        id="full_content"
                        name="full_content" 
                        value={formData.full_content}
                        onChange={handleChange}
                        placeholder="Escribe la descripción detallada, métodos de excavación, importancia del hallazgo, etc..."
                        rows={8}
                        disabled={isSubmitting}
                        className="input-textarea w-full p-4 rounded-md transition"
                        style={{
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            borderColor: errors.full_content ? 'var(--color-danger)' : 'var(--border-color)',
                            resize: 'vertical'
                        }}
                    />
                    {errors.full_content && (
                        <p className="mt-1 text-sm" style={{ color: 'var(--color-danger)' }}>{errors.full_content}</p>
                    )}
                </div>

                {/* 7. FUENTE */}
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

                {/* 8. AUTOR DEL POST Y ESTATUS DEL POST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* AUTOR DEL POST (solo lectura) */}
                    <Input
                        id="author"
                        name="author"
                        type="text"
                        label="AUTOR DEL POST"
                        value={user?.username || 'Cargando Usuario...'}
                        disabled
                        placeholder=""
                    />

                    {/* ESTATUS DEL POST (Radio Buttons) */}
                    <div>
                        <label className="block text-sm font-medium mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>
                            ESTATUS DEL POST
                        </label>
                        <div className="flex gap-6 p-3 rounded" style={{ backgroundColor: 'var(--bg-input)' }}>
                            {/* Borrador */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    checked={formData.status === 'draft'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-4 h-4 accent-[#AA7B5C] cursor-pointer"
                                />
                                <span style={{ color: 'var(--text-primary)' }}>Borrador</span>
                            </label>

                            {/* Publicado */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value="published"
                                    checked={formData.status === 'published'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="w-4 h-4 accent-[#AA7B5C] cursor-pointer"
                                />
                                <span style={{ color: 'var(--text-primary)' }}>Publicado</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
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
                        {isSubmitting ? 'Guardando...' : 'Guardar Borrador'}
                    </button>
                    
                    <button
                        type="submit" 
                        disabled={isSubmitting || isUploadingImage}
                        className="btn btn-primary"
                    >
                        {isSubmitting ? 'Publicando...' : 'Publicar Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostForm;