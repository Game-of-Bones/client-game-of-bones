import type { Post, CreatePostData, UpdatePostData } from '../types/post.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * SERVICIO DE POSTS - Game of Bones
 */
class PostService {
  /**
   * Obtener headers con autenticación
   */
  private getHeaders(includeContentType = true): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    
    if (includeContentType) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }
    
    return headers;
  }

  /**
   * Crear nuevo post
   */
  async createPost(data: CreatePostData): Promise<Post> {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear el post');
    }

    return response.json();
  }

  /**
   * Obtener todos los posts
   */
  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/posts`, {
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Error al obtener los posts');
    }

    return response.json();
  }

  /**
   * Obtener un post por ID
   */
  async getPostById(id: number): Promise<Post> {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Post no encontrado');
    }

    return response.json();
  }

  /**
   * Actualizar un post existente
   */
  async updatePost(id: number, data: UpdatePostData): Promise<Post> {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar el post');
    }

    return response.json();
  }

  /**
   * Eliminar un post
   */
  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar el post');
    }
  }

  /**
   * Obtener posts para el mapa
   */
  async getPostsForMap(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/posts/map`, {
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Error al obtener posts para el mapa');
    }

    return response.json();
  }
}

export default new PostService();