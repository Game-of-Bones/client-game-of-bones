export type FossilType = 
  | 'bones_teeth'
  | 'shell_exoskeletons'
  | 'plant_impressions'
  | 'tracks_traces'
  | 'amber_insects';

/**
 * Estado del post en el sistema.
 * 'draft' → aún no publicado.
 * 'published' → visible para todos.
 */
export type PostStatus = 'draft' | 'published';

/**
 * Estructura completa de un post recibido desde el backend.
 */
export interface Post {
  id: number;
  title: string;
  summary: string;
  post_content: string; // ✅ AÑADIDO
  image_url?: string;
  discovery_date?: string;
  location?: string;
  latitude?: number | null; // ✅ AÑADIDO
  longitude?: number | null; // ✅ AÑADIDO
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
 * Datos requeridos para crear un nuevo post.
 * No incluye campos que el backend asigna automáticamente (id, fechas, etc).
 */
export interface CreatePostData {
  title: string;
  summary: string;
  post_content: string; // ✅ AÑADIDO
  image_url?: string;
  discovery_date?: string;
  location?: string;
  latitude?: number | null; // ✅ AÑADIDO
  longitude?: number | null; // ✅ AÑADIDO
  paleontologist?: string;
  fossil_type: FossilType;
  geological_period?: string;
  status: PostStatus;
  source?: string;
  author_id: number; // ✅ AÑADIDO (necesario para crear)
}

/**
 * Datos para actualizar un post existente
 */
export interface UpdatePostData {
  title?: string;
  summary?: string;
  post_content?: string; // ✅ AÑADIDO
  image_url?: string;
  discovery_date?: string | null;
  location?: string;
  latitude?: number | null; // ✅ AÑADIDO
  longitude?: number | null; // ✅ AÑADIDO
  paleontologist?: string;
  fossil_type?: FossilType;
  geological_period?: string;
  status?: PostStatus;
  source?: string;
}


export const FOSSIL_TYPE_OPTIONS = [
  { value: 'bones_teeth' as FossilType, label: 'Huesos y Dientes' },
  { value: 'shell_exoskeletons' as FossilType, label: 'Conchas y Exoesqueletos' },
  { value: 'plant_impressions' as FossilType, label: 'Impresiones de Plantas' },
  { value: 'tracks_traces' as FossilType, label: 'Huellas y Rastros' },
  { value: 'amber_insects' as FossilType, label: 'Insectos en Ámbar' },
] as const;
