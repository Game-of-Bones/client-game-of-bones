import apiClient from './api/interceptors';
import type { Like, ToggleLikeResponse } from '../types/like.types';

// ============================================
// FUNCIONES DEL SERVICIO
// ============================================

export const toggleLike = async (postId: number): Promise<ToggleLikeResponse> => {
  try {
    const response = await apiClient.post<ToggleLikeResponse>(`/api/posts/${postId}/like`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al procesar like';
    throw new Error(message);
  }
};

export const checkIfLiked = async (postId: number): Promise<boolean> => {
  try {
    // Si tu backend tiene este endpoint:
    // const response = await apiClient.get(`/api/posts/${postId}/like/check`);
    // return response.data.liked;
    
    console.warn('⚠️ checkIfLiked: Este endpoint no existe en el backend.');
    return false;
  } catch (error: any) {
    return false;
  }
};

export const getLikesByPost = async (/* postId: number */): Promise<Like[]> => {
  try {
    console.warn('⚠️ getLikesByPost: Este endpoint no existe en el backend.');
    return [];
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al obtener likes';
    throw new Error(message);
  }
};

export const getLikesByUser = async (/* userId: number */): Promise<Like[]> => {
  try {
    console.warn('⚠️ getLikesByUser: Este endpoint no existe en el backend.');
    return [];
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al obtener likes';
    throw new Error(message);
  }
};