export interface ProfileType {
    username: string;
    email: string;
    bio: string;
    avatar: string; // URL pública del avatar (Cloudinary)
  }
  
  export interface UserStats {
    totalPosts: number;
    totalComments: number;
    joinedDate: string; // ISOString
  }
  
  export interface UserPost {
    id: string;
    title: string;
    content: string;
    createdAt: string; // ISOString
    commentsCount: number;
    
  }