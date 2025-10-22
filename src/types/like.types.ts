/**
 * TIPOS PARA LIKES
 */

export interface Like {
    id: number;
    post_id: number;
    user_id: number;
    created_at: string;
  }
  
  export interface ToggleLikeResponse {
    success: boolean;
    liked: boolean;
    message: string;
    likes_count: number;
  }