import apiService from './api/apiService'; 
import type { Post, CreatePostData, UpdatePostData } from '../types/post.types';


const BASE_URL = '/posts'; 


class PostService {
 
  async getAllPosts(): Promise<Post[]> {
    
    const response = await apiService.get<Post[]>(BASE_URL);
    return response.data;
  }

  
  async getPostById(id: number): Promise<Post> {
    const response = await apiService.get<Post>(`${BASE_URL}/${id}`);
    return response.data;
  }

  
  async createPost(data: CreatePostData): Promise<Post> {
    const response = await apiService.post<Post>(BASE_URL, data);
    return response.data;
  }

  async updatePost(id: number, data: UpdatePostData): Promise<Post> {
    const response = await apiService.put<Post>(`${BASE_URL}/${id}`, data);
    return response.data;
  }

  async deletePost(id: number): Promise<void> {
    await apiService.delete(`${BASE_URL}/${id}`);
   
  }

  async getPostsForMap(): Promise<Post[]> {
    const response = await apiService.get<Post[]>(`${BASE_URL}/map`);
    return response.data;
  }
}

export default new PostService();
