/**
 * TIPOS PARA COMENTARIOS
 */

export interface CommentAuthor {
  id: number;
  username: string;
  email: string;
}

export interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  author?: CommentAuthor;
}

export interface CreateCommentData {
  content: string;
}

export interface UpdateCommentData {
  content: string;
}