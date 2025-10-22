import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ProfileType, UserStats, UserPost } from '../types/profile.types';
import type { Post } from '../types/post.types';
import type { User } from '../types/auth.types';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import apiClient from '../services/api//axiosConfig';

// URL de la imagen por defecto
const DEFAULT_AVATAR_URL = '/Triceratops_Skull_in_Earthy_Brown.png';

// Color del texto oscuro para botones ámbar
const COLOR_TEXT_DARK = '#1D4342';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileType>({
        username: '',
        email: '',
        bio: '',
        avatar: DEFAULT_AVATAR_URL
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [userPosts, setUserPosts] = useState<UserPost[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>(DEFAULT_AVATAR_URL);
    const [stats, setStats] = useState<UserStats>({
        totalPosts: 0,
        totalComments: 0,
        joinedDate: new Date().toISOString()
    });
    const [error, setError] = useState<string>('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Cargar datos cuando el componente se monta o cuando cambia el usuario en localStorage
    useEffect(() => {
        loadUserData();
        
        // Escuchar cambios en localStorage (cuando se actualiza el usuario)
        const handleStorageChange = () => {
            loadUserData();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const loadUserData = () => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
            // Cargar datos frescos del localStorage primero
            setProfile({
                username: user.username,
                email: user.email,
                bio: '',
                avatar: user.avatar_url || DEFAULT_AVATAR_URL
            });
            setAvatarPreviewUrl(user.avatar_url || DEFAULT_AVATAR_URL);
            
            // Luego hacer fetch al backend para asegurar datos actualizados
            fetchUserProfile(user.id);
            fetchUserPosts(user.id);
        }
    };

    const getCurrentUser = (): User | null => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                const token = localStorage.getItem('token');
                if (token) {
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                return user;
            }
            return null;
        } catch (err) {
            console.error('Error parsing user from localStorage:', err);
            return null;
        }
    };

    // Fetch perfil del usuario desde el backend
    const fetchUserProfile = async (userId: number) => {
        setIsLoadingProfile(true);
        try {
            // Ajusta la ruta según tu backend - puede ser /auth/me, /api/users/:id, etc.
            const { data } = await apiClient.get<User>(`/auth/me`); // O `/users/${userId}`
            
            setProfile({
                username: data.username,
                email: data.email,
                bio: '',
                avatar: data.avatar_url || DEFAULT_AVATAR_URL
            });
            
            setAvatarPreviewUrl(data.avatar_url || DEFAULT_AVATAR_URL);
            
            setStats({
                totalPosts: 0,
                totalComments: 0,
                joinedDate: data.created_at
            });

            // Actualizar localStorage con datos frescos
            localStorage.setItem('user', JSON.stringify(data));
            setCurrentUser(data);

        } catch (err: any) {
            console.error('Error fetching profile:', err);
            // Si falla, mantener los datos del localStorage
            setError(err.response?.data?.message || 'Error al cargar el perfil');
        } finally {
            setIsLoadingProfile(false);
        }
    };

    // Fetch posts del usuario desde el backend
    const fetchUserPosts = async (userId: number) => {
        setIsLoadingPosts(true);
        try {
            // Ajusta la ruta según tu backend
            const { data } = await apiClient.get<Post[]>('/posts', {
                params: {
                    userId: userId, // O user_id según tu backend
                    status: 'published'
                }
            });
            
            const userPosts: UserPost[] = data.map(post => ({
                id: post.id.toString(),
                title: post.title,
                content: post.summary,
                createdAt: post.created_at,
                commentsCount: 0
            }));
            
            setUserPosts(userPosts);
            
            setStats(prev => ({
                ...prev,
                totalPosts: userPosts.length
            }));

        } catch (err: any) {
            console.error('Error fetching user posts:', err);
            // Si la ruta no existe o falla, mostrar vacío en lugar de error
            setUserPosts([]);
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
        if (!currentUser) return;
        
        setIsSaving(true);
        setError('');
        let updatedProfile = { ...profile };

        try {
            // Subir avatar si hay uno nuevo
            if (newAvatarFile) {
                const newAvatarUrl = await uploadAvatarToCloudinary(newAvatarFile);
                updatedProfile = { ...updatedProfile, avatar: newAvatarUrl };
            }

            // Actualizar perfil en el backend
            // Ajusta la ruta según tu backend - puede ser /auth/profile, /users/:id, etc.
            const { data } = await apiClient.put<User>(`/auth/profile`, {
                username: updatedProfile.username,
                email: updatedProfile.email,
                avatar_url: updatedProfile.avatar
            });
            
            // Actualizar localStorage con los nuevos datos
            localStorage.setItem('user', JSON.stringify(data));
            
            // Actualizar estado local
            setProfile({
                username: data.username,
                email: data.email,
                bio: updatedProfile.bio,
                avatar: data.avatar_url || DEFAULT_AVATAR_URL
            });
            
            setCurrentUser(data);
            setNewAvatarFile(null);
            setAvatarPreviewUrl(data.avatar_url || DEFAULT_AVATAR_URL);
            setIsEditing(false);

            // Disparar evento personalizado para que otros componentes se enteren del cambio
            window.dispatchEvent(new Event('userUpdated'));

        } catch (err: any) {
            console.error('Error saving profile:', err);
            setError(err.response?.data?.message || 'Error al actualizar el perfil');
            setAvatarPreviewUrl(profile.avatar);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (!currentUser) return;
        
        setProfile({
            username: currentUser.username,
            email: currentUser.email,
            bio: '',
            avatar: currentUser.avatar_url || DEFAULT_AVATAR_URL
        });
        setNewAvatarFile(null);
        setAvatarPreviewUrl(currentUser.avatar_url || DEFAULT_AVATAR_URL);
        setIsEditing(false);
        setError('');
    };

    if (!currentUser && !isLoadingProfile) {
        return (
            <div className="container-custom section-padding animate-fade-in" style={{ fontFamily: "'Playfair Display', serif" }}>
                <div className="text-center py-12">
                    <p style={{ color: 'var(--text-muted)' }}>
                        Debes iniciar sesión para ver tu perfil
                    </p>
                    <Link
                        to="/login"
                        className="btn btn-primary py-2.5 px-6 rounded-full font-semibold mt-4 inline-block"
                        style={{ backgroundColor: 'var(--color-amber)', color: COLOR_TEXT_DARK }}
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoadingProfile) {
        return (
            <div className="container-custom section-padding animate-fade-in" style={{ fontFamily: "'Playfair Display', serif" }}>
                <div className="text-center py-12">
                    <p style={{ color: 'var(--text-muted)' }}>Cargando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom section-padding animate-fade-in" style={{ fontFamily: "'Playfair Display', serif" }}>
            <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-amber)' }}>
                Mi Perfil
            </h1>

            {error && (
                <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-coral)', color: 'white' }}>
                    {error}
                </div>
            )}

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
                                <img
                                    src={avatarPreviewUrl}
                                    alt={profile.username}
                                    className="w-full h-full rounded-full object-cover border-4"
                                    style={{ borderColor: COLOR_TEXT_DARK }}
                                    onError={(e) => {
                                        // Si falla la carga de la imagen, usar la por defecto
                                        e.currentTarget.src = DEFAULT_AVATAR_URL;
                                    }}
                                />
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
                                        className="input"
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
                                        className="input"
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
                                        className="input"
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
                            Miembro desde {formatJoinedDate(stats.joinedDate)}
                        </p>

                        {/* Botones de acción */}
                        <div className="pt-2 space-y-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className={`btn btn-primary w-full py-2.5 rounded-full font-semibold transition-all hover:scale-[1.02] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={{ backgroundColor: 'var(--color-amber)', color: COLOR_TEXT_DARK }}
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
                                    style={{ backgroundColor: 'var(--color-amber)', color: COLOR_TEXT_DARK }}
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
                            Mis Posts Publicados
                        </h2>

                        {isLoadingPosts ? (
                            <div className="text-center py-8">
                                <p style={{ color: 'var(--text-muted)' }}>Cargando posts...</p>
                            </div>
                        ) : userPosts.length === 0 ? (
                            <div className="text-center py-12">
                                <p style={{ color: 'var(--text-muted)' }} className="mb-4">
                                    Aún no has publicado ningún post
                                </p>
                                <Link
                                    to="/admin/posts/new"
                                    className="btn btn-primary py-2.5 px-6 rounded-full font-semibold transition-all hover:scale-105 inline-block"
                                    style={{ backgroundColor: 'var(--color-teal)', color: COLOR_TEXT_DARK }}
                                >
                                    Crear mi primer post 🦖
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {userPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="rounded-lg flex gap-4 hover:shadow-lg transition-shadow"
                                        style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem' }}
                                    >
                                        <div 
                                            className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center" 
                                            style={{ backgroundColor: 'var(--color-amber)' }}
                                        >
                                            <span className="text-2xl font-bold" style={{ color: COLOR_TEXT_DARK }}>🦴</span>
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