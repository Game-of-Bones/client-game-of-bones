import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ProfileType, UserStats, UserPost } from '../types/profile.types';
import { uploadToCloudinary } from '../utils/cloudinaryUpload'; 

// URL de la imagen por defecto
const DEFAULT_AVATAR_URL = '/Triceratops_Skull_in_Earthy_Brown.png'; 

const mockUserStr = localStorage.getItem('user');
const mockUser = mockUserStr ? JSON.parse(mockUserStr) : {
    username: 'PaleoFanatic',
    email: 'paleo.fan@example.com',
    bio: 'Apasionado por los dinosaurios y los fósiles. Buscando el eslabón perdido entre el diseño web y la paleontología.',
    avatar: DEFAULT_AVATAR_URL 
};

// El color del modal (#1D4342) no está en las variables, lo usamos para el texto oscuro
const COLOR_TEXT_DARK = '#1D4342'; 

// ===================================

const Profile = () => {
    const [profile, setProfile] = useState<ProfileType>({
        username: mockUser?.username || '',
        email: mockUser?.email || '',
        bio: mockUser?.bio || '',
        avatar: mockUser?.avatar || DEFAULT_AVATAR_URL
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [userPosts, setUserPosts] = useState<UserPost[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>(profile.avatar);
    const [stats, setStats] = useState<UserStats>({
        totalPosts: 0,
        totalComments: 0,
        joinedDate: new Date().toISOString()
    });

    // Lógica (sin cambios)
    useEffect(() => {
        fetchUserProfile();
        fetchUserPosts();
    }, []);

    useEffect(() => {
        if (newAvatarFile) {
            setAvatarPreviewUrl(URL.createObjectURL(newAvatarFile));
        } else {
            setAvatarPreviewUrl(profile.avatar);
        }
    }, [newAvatarFile, profile.avatar]);

    const fetchUserProfile = async () => { 
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setStats({ 
                totalPosts: 12,
                totalComments: 45,
                joinedDate: new Date(Date.now() - 86400000 * 180).toISOString()
            });
        } catch (err: any) {
            console.error('Error fetching profile:', err);
        }
    };

    const fetchUserPosts = async () => { 
        setIsLoadingPosts(true); 
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockPosts: UserPost[] = Array.from({ length: 3 }, (_, i) => ({
                id: `${i + 1}`,
                title: `Mi hallazgo de fósil # ${i + 1}`,
                content: `Breve descripción de este asombroso descubrimiento paleontológico. ¡El post más completo está en el blog!`,
                createdAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
                commentsCount: Math.floor(Math.random() * 10)
            }));
            
            setUserPosts(mockPosts); 
        } catch (err: any) {
            console.error('Error fetching user posts:', err);
        } finally {
            setIsLoadingPosts(false);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const formatJoinedDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long'
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setNewAvatarFile(file);
        }
    };

    const uploadAvatarToCloudinary = async (file: File): Promise<string> => {
        try {
            const url = await uploadToCloudinary(file);
            return url;
        } catch (error: any) {
            throw new Error(`Fallo al subir a Cloudinary: ${error.message}`);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        let updatedProfile = { ...profile };

        try {
            if (newAvatarFile) {
                const newAvatarUrl = await uploadAvatarToCloudinary(newAvatarFile);
                updatedProfile = { ...updatedProfile, avatar: newAvatarUrl };
                setProfile(updatedProfile); 
                setNewAvatarFile(null);
            }

            // MOCK
            const updatedUser = { ...mockUser, ...updatedProfile };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setIsEditing(false);

        } catch (err: any) {
            alert('Error al guardar el perfil: ' + err.message);
            setAvatarPreviewUrl(profile.avatar);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setProfile({
            username: mockUser?.username || '',
            email: mockUser?.email || '',
            bio: mockUser?.bio || '',
            avatar: mockUser?.avatar || DEFAULT_AVATAR_URL 
        });
        setNewAvatarFile(null);
        setAvatarPreviewUrl(profile.avatar); 
        setIsEditing(false);
    };
    
    // ===================================
    // Renderizado del componente (JSX) - USANDO VARIABLES CSS
    // ===================================
    return (
        <div className="container-custom section-padding animate-fade-in" style={{ fontFamily: "'Playfair Display', serif" }}>
            <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-amber)' }}>
                Mi Perfil
            </h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Columna izquierda: Información del usuario */}
                <div className="md:col-span-1">
                    <div 
                        className="card p-6 rounded-xl shadow-2xl" 
                        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    >
                        {/* Avatar y Campo de Carga */}
                        <div className="text-center mb-4">
                            <div 
                                className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-3 border-4"
                                style={{ borderColor: 'var(--color-amber)', backgroundColor: 'var(--bg-secondary)' }}
                            >
                                {avatarPreviewUrl ? (
                                    <img
                                        src={avatarPreviewUrl}
                                        alt={profile.username}
                                        className="w-full h-full rounded-full object-cover border-4"
                                        // Acento oscuro sutil del color del modal
                                        style={{ borderColor: COLOR_TEXT_DARK }} 
                                    />
                                ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>
                                        {profile.username.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            
                            {/* Botón y Input para cambiar avatar */}
                            {isEditing && (
                                <div className="relative inline-block mt-2">
                                    <button className="text-sm hover:underline font-semibold" style={{ color: 'var(--color-amber)' }}>
                                        {newAvatarFile ? 'Foto seleccionada' : 'Cambiar foto'}
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={isSaving}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Formulario de Edición / Vista de Perfil */}
                        <div className="flex flex-col gap-3">
                            {/* Username */}
                            <div className="mb-2">
                                <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                                    Nombre de usuario
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={profile.username}
                                        onChange={handleChange}
                                        className="input" // Usa la clase .input global
                                        style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}
                                        disabled={isSaving}
                                    />
                                ) : (
                                    <p className="text-xl font-bold" style={{ color: 'var(--color-amber)' }}>
                                        {profile.username}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-2">
                                <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        className="input" // Usa la clase .input global
                                        style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}
                                        disabled={isSaving}
                                    />
                                ) : (
                                    <p className="text-gray-600" style={{ color: 'var(--text-muted)' }}>
                                        {profile.email}
                                    </p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                                    Biografía
                                </label>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Cuéntanos sobre ti..."
                                        className="input" // Usa la clase .input global
                                        style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}
                                        disabled={isSaving}
                                    />
                                ) : (
                                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                        {profile.bio || 'Sin biografía'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="border-t pt-4" style={{ borderColor: 'var(--border-light)' }}>
                            <div className="flex justify-around text-center">
                                <div>
                                    <p className="text-2xl font-bold" style={{ color: 'var(--color-teal)' }}>{stats.totalPosts}</p>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Posts</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold" style={{ color: 'var(--color-teal)' }}>{stats.totalComments}</p>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Comentarios</p>
                                </div>
                            </div>
                        </div>

                        {/* Fecha de registro */}
                        <p className="text-xs text-center pt-2" style={{ color: 'var(--text-muted)' }}>
                            Miembro desde **{formatJoinedDate(stats.joinedDate)}**
                        </p>

                        {/* Botones de acción */}
                        <div className="pt-2 space-y-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className={`btn btn-primary w-full py-2.5 rounded-full font-semibold transition-all hover:scale-[1.02] ${isSaving ? 'loading' : ''}`}
                                        style={{ backgroundColor: 'var(--color-amber)', color: COLOR_TEXT_DARK }} // Texto oscuro en botón ámbar
                                    >
                                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={isSaving}
                                        className="btn btn-secondary w-full py-2.5 rounded-full font-semibold transition-all hover:scale-[1.02]"
                                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary w-full py-2.5 rounded-full font-semibold transition-all hover:scale-[1.02]"
                                    style={{ backgroundColor: 'var(--color-amber)', color: COLOR_TEXT_DARK }} // Texto oscuro en botón ámbar
                                >
                                    Editar Perfil
                                </button>
                            )}
                        </div>
                        
                        {/* Opciones de configuración adicionales */}
                        <div className="pt-4 border-t mt-4" style={{ borderColor: 'var(--border-light)' }}>
                            <Link to="/settings/password" className="block text-sm hover:underline" style={{ color: 'var(--color-teal)' }}>
                                Cambiar contraseña
                            </Link>
                            <button className="text-sm mt-2 hover:underline" style={{ color: 'var(--color-coral)' }}>
                                Eliminar cuenta
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna derecha: Posts del usuario */}
                <div className="md:col-span-2">
                    <div className="card p-6 rounded-xl shadow-2xl" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-amber)' }}>
                            Mis Posts
                        </h2>

                        {isLoadingPosts ? (
                            <div className="text-center py-8">
                                <p style={{ color: 'var(--text-muted)' }}>Cargando posts...</p>
                            </div>
                        ) : userPosts.length === 0 ? (
                            <div className="text-center py-12">
                                <p style={{ color: 'var(--text-muted)' }} className="mb-4">
                                    Aún no has creado ningún post
                                </p>
                                <Link
                                    to="/admin/posts/new"
                                    className="btn btn-primary py-2.5 px-6 rounded-full font-semibold transition-all hover:scale-105"
                                    style={{ backgroundColor: 'var(--color-teal)', color: COLOR_TEXT_DARK }} // Botón teal con texto oscuro
                                >
                                    Crear mi primer post 🦖
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="card-horizontal" // Usa la clase .card-horizontal global
                                        style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', gap: '1rem' }}
                                    >
                                        <div 
                                            className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center" 
                                            style={{ backgroundColor: 'var(--color-amber)' }}
                                        >
                                            <span className="text-2xl font-bold" style={{ color: COLOR_TEXT_DARK }}>F</span>
                                        </div>
                                        
                                        <div className="flex-grow">
                                            <Link to={`/posts/${post.id}`}>
                                                <h3 className="text-xl font-semibold mb-1 hover:underline" style={{ color: 'var(--color-amber)' }}>
                                                    {post.title}
                                                </h3>
                                            </Link>
                                            
                                            <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                                {post.content}
                                            </p>

                                            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                                                <span>
                                                    {new Date(post.createdAt).toLocaleDateString('es-ES')}
                                                </span>
                                                <span style={{ color: 'var(--color-teal)' }}>{post.commentsCount} comentarios</span>
                                            </div>

                                            <div className="flex gap-4 mt-2 text-sm">
                                                <Link
                                                    to={`/admin/posts/${post.id}/edit`}
                                                    className="hover:underline"
                                                    style={{ color: 'var(--color-teal)' }}
                                                >
                                                    Editar
                                                </Link>
                                                <Link
                                                    to={`/posts/${post.id}`}
                                                    className="hover:underline"
                                                    style={{ color: 'var(--color-teal)' }}
                                                >
                                                    Ver
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;