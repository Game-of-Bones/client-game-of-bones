// src/pages/Profile.tsx
// Página de perfil de usuario (ruta protegida)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// TODO: Importar servicios cuando estén disponibles
// import { getUserProfile, updateProfile } from '../services/userService';
// import { getUserPosts } from '../services/postService';
// import { useAuth } from '../hooks/useAuth';

/**
 * Profile - Página de perfil del usuario autenticado
 * 
 * Funcionalidad:
 * - Mostrar información del usuario (avatar, username, email, bio, etc)
 * - Editar perfil (nombre, bio, avatar)
 * - Cambiar contraseña
 * - Lista de posts del usuario
 * - Estadísticas (total posts, comentarios, etc)
 * - Eliminar cuenta (con confirmación)
 */
const Profile = () => {
  // TODO: Descomentar cuando useAuth esté implementado
  // const { user, updateUser } = useAuth();

  // MOCK temporal
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Estado del perfil
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  // Estado para modo edición
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estado para los posts del usuario
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Estado para estadísticas
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    joinedDate: new Date().toISOString()
  });

  /**
   * Cargar datos del perfil al montar
   */
  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, []);

  /**
   * Obtener datos completos del perfil
   */
  const fetchUserProfile = async () => {
    try {
      // TODO: Implementar cuando el servicio esté listo
      // const response = await getUserProfile();
      // setProfile(response);
      // setStats(response.stats);

      // MOCK temporal
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStats({
        totalPosts: 12,
        totalComments: 45,
        joinedDate: new Date(Date.now() - 86400000 * 180).toISOString() // 6 meses atrás
      });

    } catch (err: any) {
      console.error('Error fetching profile:', err);
    }
  };

  /**
   * Obtener posts del usuario
   */
  const fetchUserPosts = async () => {
    setIsLoadingPosts(true);

    try {
      // TODO: Implementar cuando el servicio esté listo
      // const response = await getUserPosts(user.id);
      // setUserPosts(response);

      // MOCK temporal
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockPosts = Array.from({ length: 3 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Mi post épico ${i + 1}`,
        content: 'Resumen del contenido del post...',
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

  /**
   * Maneja cambios en el formulario de edición
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Guarda los cambios del perfil
   */
  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      // TODO: Implementar cuando el servicio esté listo
      // await updateProfile(profile);
      // updateUser(profile); // Actualizar en el contexto

      // MOCK temporal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar localStorage (temporal)
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // TODO: Mostrar notificación de éxito
      // toast.success('Perfil actualizado correctamente');

      setIsEditing(false);

    } catch (err: any) {
      // TODO: Mostrar notificación de error
      // toast.error('Error al actualizar perfil');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancela la edición y restaura valores originales
   */
  const handleCancelEdit = () => {
    setProfile({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  /**
   * Formatea la fecha de registro
   */
  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Columna izquierda: Información del usuario */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Avatar */}
            <div className="text-center mb-4">
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-3">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Botón para cambiar avatar */}
              {isEditing && (
                <button className="text-sm text-blue-600 hover:underline">
                  Cambiar foto
                </button>
              )}
            </div>

            {/* Username */}
            {isEditing ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-center mb-2">
                {profile.username}
              </h2>
            )}

            {/* Email */}
            {isEditing ? (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <p className="text-gray-600 text-center mb-4">
                {profile.email}
              </p>
            )}

            {/* Bio */}
            <div className="mb-4">
              {isEditing ? (
                <>
                  <label className="block text-sm font-medium mb-1">
                    Biografía
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Cuéntanos sobre ti..."
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Bio</h3>
                  <p className="text-gray-600 text-sm">
                    {profile.bio || 'Sin biografía'}
                  </p>
                </>
              )}
            </div>

            {/* Estadísticas */}
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-bold">{stats.totalPosts}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalComments}</p>
                  <p className="text-sm text-gray-600">Comentarios</p>
                </div>
              </div>
            </div>

            {/* Fecha de registro */}
            <p className="text-sm text-gray-500 text-center mb-4">
              Miembro desde {formatJoinedDate(stats.joinedDate)}
            </p>

            {/* Botones de acción */}
            {isEditing ? (
              <div className="space-y-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="w-full py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {/* TODO: Sección de configuración adicional */}
          {/*
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h3 className="font-semibold mb-3">Configuración</h3>
            <Link to="/settings/password" className="block text-sm text-blue-600 hover:underline mb-2">
              Cambiar contraseña
            </Link>
            <Link to="/settings/privacy" className="block text-sm text-blue-600 hover:underline mb-2">
              Privacidad
            </Link>
            <button className="text-sm text-red-600 hover:underline">
              Eliminar cuenta
            </button>
          </div>
          */}
        </div>

        {/* Columna derecha: Posts del usuario */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Mis Posts</h2>

            {isLoadingPosts ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Cargando posts...</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Aún no has creado ningún post</p>
                <Link
                  to="/admin/posts/new"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Crear mi primer post
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <Link to={`/posts/${post.id}`}>
                      <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('es-ES')}
                      </span>
                      <span>{post.commentsCount} comentarios</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Editar
                      </Link>
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                ))}

                {/* TODO: Agregar paginación si hay muchos posts */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Servicios necesarios (src/services/userService.ts):
 *    - getUserProfile(): obtener datos completos del usuario
 *    - updateProfile(data): actualizar perfil
 *    - uploadAvatar(file): subir foto de perfil
 *    - changePassword(oldPass, newPass)
 *    - deleteAccount()
 * 
 * 2. Upload de avatar:
 *    - Input de tipo file para seleccionar imagen
 *    - Preview antes de subir
 *    - Validar tamaño y formato (JPG, PNG, máx 2MB)
 *    - Crop/resize de imagen en el cliente
 *    - Usar FormData para enviar al backend
 * 
 * 3. Tabs para organizar contenido:
 *    - Tab "Posts": posts del usuario
 *    - Tab "Comentarios": comentarios recientes
 *    - Tab "Guardados": posts guardados/favoritos
 *    - Tab "Borradores": posts no publicados
 * 
 * 4. Cambiar contraseña:
 *    - Modal o página separada
 *    - Campos: contraseña actual, nueva, confirmar nueva
 *    - Validar fortaleza de la nueva contraseña
 *    - Endpoint: PUT /auth/change-password
 * 
 * 5. Eliminar cuenta:
 *    - Modal de confirmación con warnings
 *    - Requerir contraseña para confirmar
 *    - Opción de "desactivar" en lugar de eliminar permanentemente
 *    - Email de confirmación de eliminación
 * 
 * 6. Página de perfil público:
 *    - Crear src/pages/UserProfile.tsx
 *    - Ruta: /users/:username
 *    - Mostrar posts públicos del usuario
 *    - Sin opciones de edición
 * 
 * 7. Configuración de privacidad:
 *    - Perfil público/privado
 *    - Mostrar email públicamente (sí/no)
 *    - Permitir mensajes directos
 *    - Notificaciones (email, push)
 * 
 * 8. Actividad reciente:
 *    - Timeline de acciones del usuario
 *    - Posts creados, comentarios, likes dados
 *    - Con filtros por tipo de actividad
 * 
 * 9. Badges/Achievements:
 *    - Sistema de logros (primer post, 10 posts, 100 comentarios, etc)
 *    - Mostrar badges en el perfil
 *    - Gamificación para incentivar participación
 * 
 * 10. Estadísticas avanzadas:
 *     - Gráficos de posts por mes
 *     - Posts más populares
 *     - Engagement rate
 *     - Usar librería de gráficos (recharts, chart.js)
 */