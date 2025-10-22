/**
 * EXPORTACIÓN CENTRALIZADA DE SERVICIOS
 */

// Auth Service
export {
    register,
    login,
    logout,
    getCurrentUser,
    isAdmin,
    isAuthenticated,
    getToken,
  } from './authService';
  
  // Post Service
  export {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
  } from './postService';
  
  // Comment Service
  export {
    getCommentsByPost,
    createComment,
    updateComment,
    deleteComment,
    getCommentsByUser,
  } from './commentService';
  
  // Like Service
  export {
    toggleLike,
    checkIfLiked,
    getLikesByPost,
    getLikesByUser,
  } from './likeService';
  
  // Axios client
  export { default as apiClient } from './api/interceptors';
  
  // ============================================
  // EXPORTAR TIPOS
  // ============================================
  export type { Post, CreatePostData, UpdatePostData, FossilType, PostStatus } from '../types/post.types';
  export type { User, LoginCredentials, RegisterData } from '../types/auth.types';
  export type { Comment, CreateCommentData, UpdateCommentData } from '../types/comment.types';
  export type { Like, ToggleLikeResponse } from '../types/like.types';