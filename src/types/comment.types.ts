// Interfaz para el autor del comentario, que vendrá anidado desde el backend
export interface CommentAuthor {
    id: number;
    username: string;
    profile_image: string; // O 'avatar', dependiendo de lo que envíe tu API
  }
  
  // Interfaz principal para un comentario
  export interface Comment {
    id: number;
    content: string;
    created_at: string; // La API normalmente envía las fechas como strings ISO
    author: CommentAuthor; // Usamos la interfaz anidada
  }
  
  // Opcional: Tipos para crear o actualizar comentarios en el futuro
  export interface CreateCommentData {
    post_id: number;
    content: string;
  }
  
  export interface UpdateCommentData {
    content: string;
  }