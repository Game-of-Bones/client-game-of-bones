import apiClient from './api/interceptors';
import type { Comment, CreateCommentData, UpdateCommentData } from '../types/comment.types';

// ============================================
// TIPOS DE RESPUESTA
// ============================================

interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    count: number;
  };
}

interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

// ============================================
// FUNCIONES DEL SERVICIO
// ============================================

export const getCommentsByPost = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await apiClient.get<CommentsResponse>(`/api/posts/${postId}/comments`);
    return response.data.data.comments;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al obtener comentarios';
    throw new Error(message);
  }
};

export const createComment = async (postId: number, data: CreateCommentData): Promise<Comment> => {
  try {
    const response = await apiClient.post<CommentResponse>(
      `/api/posts/${postId}/comments`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al crear comentario';
    throw new Error(message);
  }
};

export const updateComment = async (id: number, data: UpdateCommentData): Promise<Comment> => {
  try {
    const response = await apiClient.put<CommentResponse>(`/api/comments/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al actualizar comentario';
    throw new Error(message);
  }
};

export const deleteComment = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/comments/${id}`);
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al eliminar comentario';
    throw new Error(message);
  }
};

export const getCommentsByUser = async (userId: number): Promise<Comment[]> => {
  try {
    const response = await apiClient.get<CommentsResponse>(`/api/users/${userId}/comments`);
    return response.data.data.comments;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al obtener comentarios';
    throw new Error(message);
  }
};