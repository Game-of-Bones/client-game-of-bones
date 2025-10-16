/**
 * GOB SERVICES - Game of Bones
 * Servicios para comentarios y likes
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Obtener headers con autenticación
 */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// ============================================
// COMMENTS SERVICE
// ============================================

export const commentsAPI = {
  /**
   * Obtener comentarios de un post
   */
  async getByPost(postId: number) {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);

    if (!response.ok) {
      throw new Error('Error al obtener comentarios');
    }

    const result = await response.json();
    return result.data.comments; // Backend devuelve { success, data: { comments, count } }
  },

  /**
   * Crear comentario
   */
  async create(postId: number, content: string) {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear comentario');
    }

    const result = await response.json();
    return result.data; // Backend devuelve { success, message, data: comment }
  },

  /**
   * Actualizar comentario
   */
  async update(commentId: number, content: string) {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar comentario');
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Eliminar comentario
   */
  async delete(commentId: number) {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar comentario');
    }

    return true;
  },
};

// ============================================
// LIKES SERVICE
// ============================================

export const likesAPI = {
  /**
   * Toggle like (dar/quitar like)
   */
  async toggle(postId: number) {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al dar like');
    }

    const result = await response.json();
    return result.data; // Backend devuelve { success, message, data: { liked, postId, likeId } }
  },

  /**
   * Obtener likes de un post
   */
  async getByPost(postId: number, page = 1, limit = 20) {
    const response = await fetch(
      `${API_URL}/posts/${postId}/likes?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Error al obtener likes');
    }

    const result = await response.json();
    return result.data; // Backend devuelve { success, data: { likes, count, pagination } }
  },

  /**
   * Verificar si el usuario dio like
   */
  async checkUserLike(postId: number) {
    const response = await fetch(`${API_URL}/posts/${postId}/like/check`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return { liked: false };
    }

    const result = await response.json();
    return result.data; // Backend devuelve { success, data: { liked } }
  },
};
