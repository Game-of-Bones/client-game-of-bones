import { create } from 'zustand';
import { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost,
  type Post,
  type CreatePostData,
  type UpdatePostData,
  type PostStatus,
  type FossilType
} from '../services';

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
}

interface PostActions {
  fetchPosts: (filters?: {
    status?: PostStatus;
    fossil_type?: FossilType;
    user_id?: number;
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchPostById: (id: number) => Promise<Post>; // ✅ Ahora retorna Post
  createPost: (data: CreatePostData) => Promise<Post>;
  updatePost: (id: number, data: UpdatePostData) => Promise<Post>;
  deletePost: (id: number) => Promise<void>;
  clearError: () => void;
  clearCurrentPost: () => void;
}

export const usePostStore = create<PostState & PostActions>((set) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,

  fetchPosts: async (filters) => {
    set({ isLoading: true, error: null });

    try {
      const data = await getAllPosts(filters);
      set({ posts: data.posts, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar los posts',
        isLoading: false,
      });
    }
  },

  fetchPostById: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      const post = await getPostById(id);
      set({ currentPost: post, isLoading: false });
      return post; // ✅ Retornar el post
    } catch (error: any) {
      set({
        error: error.message || 'Post no encontrado',
        isLoading: false,
        currentPost: null,
      });
      throw error; // ✅ Propagar el error
    }
  },

  createPost: async (data: CreatePostData) => {
    set({ isLoading: true, error: null });

    try {
      const newPost = await createPost(data);
      
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

  updatePost: async (id: number, data: UpdatePostData) => {
    set({ isLoading: true, error: null });

    try {
      const updatedPost = await updatePost(id, data);

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

  deletePost: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      await deletePost(id);

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

  clearError: () => {
    set({ error: null });
  },

  clearCurrentPost: () => {
    set({ currentPost: null });
  },
}));