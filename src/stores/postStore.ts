import { create } from 'zustand';
import postService from '../services/postService';
import type { Post, CreatePostData, UpdatePostData } from '../types/post.types';

/**
 * ZUSTAND POST STORE - Game of Bones
 */

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
}

interface PostActions {
  fetchPosts: () => Promise<void>;
  fetchPostById: (id: number) => Promise<void>;
  createPost: (data: CreatePostData) => Promise<Post>;
  updatePost: (id: number, data: UpdatePostData) => Promise<Post>;
  deletePost: (id: number) => Promise<void>;
  clearError: () => void;
  clearCurrentPost: () => void;
}

export const usePostStore = create<PostState & PostActions>((set, get) => ({
  // ========================================
  // ESTADO INICIAL
  // ========================================
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,

  // ========================================
  // ACCIONES
  // ========================================

  /**
   * Obtener todos los posts
   */
  fetchPosts: async () => {
    set({ isLoading: true, error: null });

    try {
      const posts = await postService.getAllPosts();
      set({ posts, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar los posts',
        isLoading: false,
      });
    }
  },

  /**
   * Obtener un post por ID
   */
  fetchPostById: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const post = await postService.getPostById(id);
      set({ currentPost: post, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Post no encontrado',
        isLoading: false,
        currentPost: null,
      });
    }
  },

  /**
   * Crear nuevo post
   */
  createPost: async (data: CreatePostData) => {
    set({ isLoading: true, error: null });

    try {
      const newPost = await postService.createPost(data);
      
      // Añadir el nuevo post a la lista
      set((state) => ({
        posts: [newPost, ...state.posts],
        isLoading: false,
      }));

      return newPost;
    } catch (error: any) {
      set({
        error: error.message || 'Error al crear el post',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Actualizar post existente
   */
  updatePost: async (id: number, data: UpdatePostData) => {
    set({ isLoading: true, error: null });

    try {
      const updatedPost = await postService.updatePost(id, data);

      // Actualizar en la lista de posts
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? updatedPost : post
        ),
        currentPost: state.currentPost?.id === id ? updatedPost : state.currentPost,
        isLoading: false,
      }));

      return updatedPost;
    } catch (error: any) {
      set({
        error: error.message || 'Error al actualizar el post',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Eliminar post
   */
  deletePost: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      await postService.deletePost(id);

      // Eliminar de la lista
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
        currentPost: state.currentPost?.id === id ? null : state.currentPost,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Error al eliminar el post',
        isLoading: false,
      });
      throw error;
    }
  },

  /**
   * Limpiar errores
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Limpiar post actual
   */
  clearCurrentPost: () => {
    set({ currentPost: null });
  },
}));