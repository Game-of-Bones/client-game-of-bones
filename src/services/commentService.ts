// Asumimos que tienes un tipo Comment definido en algún lugar central
// import type { Comment } from '../types/comment.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class CommentService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Eliminar un comentario por su ID
   */
  async deleteComment(id: number | string): Promise<void> {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar el comentario');
    }
  }
}

export default new CommentService();