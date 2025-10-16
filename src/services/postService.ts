/**
 * SERVICIO DE POSTS
 * 
 * Funciones para gestionar posts (descubrimientos de fósiles):
 * - Listar posts (con paginación y filtros)
 * - Obtener post por ID
 * - Crear post
 * - Actualizar post
 * - Eliminar post
 */

import apiClient from './api/interceptors';
import type { Post, CreatePostData, UpdatePostData, FossilType, PostStatus } from '../types/post.types';

// ============================================
// TIPOS DE RESPUESTA (solo lo que falta)
// ============================================

interface PostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

interface PostResponse {
  success: boolean;
  data: Post;
}

// ============================================
// FUNCIONES DEL SERVICIO
// ============================================

/**
 * Obtener todos los posts con filtros opcionales
 * GET /api/posts?status=published&fossil_type=bones_teeth&page=1&limit=10
 */
export const getAllPosts = async (filters?: {
  status?: PostStatus;
  fossil_type?: FossilType;
  user_id?: number;
  page?: number;
  limit?: number;
}): Promise<PostsResponse['data']> => {
  try {
    // Construir query params
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.fossil_type) params.append('fossil_type', filters.fossil_type);
    if (filters?.user_id) params.append('user_id', filters.user_id.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get<PostsResponse>(`/api/posts?${params.toString()}`);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al obtener posts';
    throw new Error(message);
  }
};

/**
 * Obtener un post por ID
 * GET /api/posts/:id
 */
export const getPostById = async (id: number): Promise<Post> => {
  try {
    const response = await apiClient.get<PostResponse>(`/api/posts/${id}`);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Post no encontrado';
    throw new Error(message);
  }
};

/**
 * Crear un nuevo post
 * POST /api/posts
 * Requiere autenticación
 */
export const createPost = async (data: CreatePostData): Promise<Post> => {
  try {
    const response = await apiClient.post<PostResponse>('/api/posts', data);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al crear post';
    throw new Error(message);
  }
};

/**
 * Actualizar un post existente
 * PUT /api/posts/:id
 * Requiere ser el autor o admin
 */
export const updatePost = async (id: number, data: UpdatePostData): Promise<Post> => {
  try {
    const response = await apiClient.put<PostResponse>(`/api/posts/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al actualizar post';
    throw new Error(message);
  }
};

/**
 * Eliminar un post (soft delete)
 * DELETE /api/posts/:id
 * Requiere ser el autor o admin
 */
export const deletePost = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/posts/${id}`);
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al eliminar post';
    throw new Error(message);
  }
};
