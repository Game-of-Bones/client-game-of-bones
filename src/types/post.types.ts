// src/types/post.types.ts

export type FossilType = 
  | 'bones_teeth'
  | 'shell_exoskeletons'
  | 'plant_impressions'
  | 'tracks_traces'
  | 'amber_insects';

export type PostStatus = 'draft' | 'published';

/**
 * Post completo tal como viene del backend
 */
export interface Post {
  id: number;
  title: string;
  summary: string;
  image_url?: string;
  discovery_date?: string;
  location?: string;
  paleontologist?: string;
  fossil_type: FossilType;
  geological_period?: string;
  status: PostStatus;
  source?: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones opcionales que puede incluir el backend
  author?: {
    id: number;
    username: string;
    email: string;
  };
}

/**
 * Datos para crear un nuevo post
 */
export interface CreatePostData {
  title: string;
  summary: string;
  image_url?: string;
  discovery_date?: string;
  location?: string;
  paleontologist?: string;
  fossil_type: FossilType;
  geological_period?: string;
  status: PostStatus;
  source?: string;
}

/**
 * Datos para actualizar un post existente
 * Todos los campos son opcionales excepto los que siempre deben estar
 */
export interface UpdatePostData {
  title?: string;
  summary?: string;
  image_url?: string;
  discovery_date?: string;
  location?: string;
  paleontologist?: string;
  fossil_type?: FossilType;
  geological_period?: string;
  status?: PostStatus;
  source?: string;
}

/**
 * Opciones de tipos de fósil para selectores
 */
export const FOSSIL_TYPE_OPTIONS = [
  { value: 'bones_teeth' as FossilType, label: 'Huesos y Dientes' },
  { value: 'shell_exoskeletons' as FossilType, label: 'Conchas y Exoesqueletos' },
  { value: 'plant_impressions' as FossilType, label: 'Impresiones de Plantas' },
  { value: 'tracks_traces' as FossilType, label: 'Huellas y Rastros' },
  { value: 'amber_insects' as FossilType, label: 'Insectos en Ámbar' },
] as const;