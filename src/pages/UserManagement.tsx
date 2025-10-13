// Página de gestión de usuarios (solo para administradores)

import { useState, useEffect } from 'react';
// TODO: Importar servicios cuando estén disponibles
// import { getUsers, updateUserRole, deleteUser } from '../services/userService';
// import { useAuth } from '../hooks/useAuth';

/**
 * UserManagement - Página de administración de usuarios
 * 
 * SOLO ACCESIBLE PARA ADMINISTRADORES
 * 
 * Funcionalidad:
 * - Listar todos los usuarios registrados
 * - Ver detalles de cada usuario (email, fecha de registro, posts creados)
 * - Cambiar rol de usuario (user <-> admin)
 * - Eliminar usuarios (soft delete)
 * - Buscar usuarios por nombre/email
 * - Filtrar por rol
 * - Ver estadísticas de actividad
 */

// Tipo basado en el modelo User del backend
// NOTA: Necesito ver tu modelo User completo para ajustar esto
interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin'; // Ajustar según tu modelo
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  // Estadísticas (pueden venir del backend o calcularse)
  postsCount?: number;
  commentsCount?: number;
  lastLogin?: Date | null;
}

const UserManagement = () => {
  // TODO: Verificar que el usuario actual es admin
  // const { user } = useAuth();
  // if (!user || user.role !== 'admin') navigate('/');

  // Estado para usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

  // Estado para modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  /**
   * Cargar usuarios desde el backend
   */
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        // TODO: Implementar cuando el servicio esté listo
        // const response = await getUsers({
        //   search: searchTerm,
        //   role: roleFilter !== 'all' ? roleFilter : undefined
        // });
        // setUsers(response.data);

        // MOCK temporal - ELIMINAR cuando el servicio esté listo
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockUsers: User[] = [
          {
            id: 1,
            username: "admin_user",
            email: "admin@gameofbones.com",
            role: "admin",
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date(),
            postsCount: 15,
            commentsCount: 45,
            lastLogin: new Date('2025-10-13')
          },
          {
            id: 2,
            username: "paleofan",
            email: "paleofan@email.com",
            role: "user",
            createdAt: new Date('2024-03-20'),
            updatedAt: new Date(),
            postsCount: 8,
            commentsCount: 23,
            lastLogin: new Date('2025-10-12')
          },
          {
            id: 3,
            username: "fossil_hunter",
            email: "hunter@email.com",
            role: "user",
            createdAt: new Date('2024-06-10'),
            updatedAt: new Date(),
            postsCount: 3,
            commentsCount: 12,
            lastLogin: new Date('2025-10-10')
          }
        ];
        
        setUsers(mockUsers);

      } catch (err: any) {
        setError(err.message || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, roleFilter]);

  /**
   * Cambiar rol de un usuario
   */
  const handleRoleChange = async (userId: number, newRole: 'user' | 'admin') => {
    try {
      // TODO: Implementar cuando el servicio esté listo
      // await updateUserRole(userId, newRole);
      
      // Actualizar estado local
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));

      console.log(`Cambiar rol de usuario ${userId} a ${newRole}`);
      
    } catch (err: any) {
      setError(err.message || 'Error al cambiar rol');
    }
  };

  /**
   * Abrir modal de confirmación de eliminación
   */
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  /**
   * Eliminar usuario (soft delete)
   */
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      // TODO: Implementar cuando el servicio esté listo
      // await deleteUser(userToDelete.id);
      
      // Remover del estado local
      setUsers(users.filter(u => u.id !== userToDelete.id));
      
      console.log(`Usuario ${userToDelete.id} eliminado`);
      
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario');
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  /**
   * Filtrar usuarios según búsqueda
   */
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios de la plataforma</p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Usuarios</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Usuarios Activos</p>
          <p className="text-2xl font-bold">{users.filter(u => !u.deletedAt).length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Administradores</p>
          <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Nuevos (este mes)</p>
          <p className="text-2xl font-bold">
            {users.filter(u => {
              const monthAgo = new Date();
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return new Date(u.createdAt) > monthAgo;
            }).length}
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filtro por rol */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los roles</option>
          <option value="user">Usuarios</option>
          <option value="admin">Administradores</option>
        </select>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tabla de usuarios */}
      {loading ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="animate-pulse p-4 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      {/* Usuario */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>

                      {/* Rol */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          <option value="user">Usuario</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Actividad */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <div>{user.postsCount || 0} posts</div>
                          <div>{user.commentsCount || 0} comentarios</div>
                        </div>
                      </td>

                      {/* Registro */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar al usuario{' '}
              <strong>{userToDelete.username}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Endpoints del backend:
 *    - GET /api/admin/users
 *      Query params: search, role, page, limit
 *      Response: { data: User[], total: number, page: number }
 *    
 *    - PATCH /api/admin/users/:id/role
 *      Body: { role: 'admin' | 'user' }
 *      Auth: Requiere token de admin
 *    
 *    - DELETE /api/admin/users/:id
 *      Soft delete (paranoid)
 *      Auth: Requiere token de admin
 *    
 *    - GET /api/admin/users/:id/stats
 *      Response: { postsCount, commentsCount, likesCount, lastLogin }
 * 
 * 2. Servicio de usuarios (src/services/userService.ts):
 *    export const getUsers = async (filters: any) => {
 *      const params = new URLSearchParams(filters);
 *      const response = await fetch(`/api/admin/users?${params}`, {
 *        headers: { 'Authorization': `Bearer ${getToken()}` }
 *      });
 *      return response.json();
 *    };
 *    
 *    export const updateUserRole = async (userId: number, role: string) => {
 *      const response = await fetch(`/api/admin/users/${userId}/role`, {
 *        method: 'PATCH',
 *        headers: {
 *          'Content-Type': 'application/json',
 *          'Authorization': `Bearer ${getToken()}`
 *        },
 *        body: JSON.stringify({ role })
 *      });
 *      return response.json();
 *    };
 *    
 *    export const deleteUser = async (userId: number) => {
 *      await fetch(`/api/admin/users/${userId}`, {
 *        method: 'DELETE',
 *        headers: { 'Authorization': `Bearer ${getToken()}` }
 *      });
 *    };
 * 
 * 3. Protección de ruta:
 *    - Usar AdminRoute component para envolver esta página
 *    - Verificar role === 'admin' en el backend para TODAS las operaciones
 *    - Redirigir a home si no es admin
 * 
 * 4. Características adicionales:
 *    - Ver perfil completo del usuario (modal con todos sus posts/comments)
 *    - Exportar lista de usuarios a CSV
 *    - Gráficos de actividad (Chart.js)
 *    - Suspender usuarios (estado 'suspended' en lugar de delete)
 *    - Enviar emails masivos a usuarios
 *    - Logs de actividad de admin
 * 
 * 5. Paginación:
 *    - Agregar controles de paginación como en PostList
 *    - Mostrar X usuarios por página (configurable)
 * 
 * 6. Validaciones:
 *    - No permitir que un admin se elimine a sí mismo
 *    - No permitir que un admin cambie su propio rol a user
 *    - Confirmar cambios de rol con un segundo modal
 * 
 * 7. Búsqueda avanzada:
 *    - Filtrar por fecha de registro (rango)
 *    - Filtrar por actividad (usuarios sin posts, usuarios inactivos)
 *    - Ordenar por diferentes criterios
 * 
 * 8. Notificaciones:
 *    - Toast notifications cuando se realiza una acción
 *    - Confirmar éxito/error de operaciones
 */