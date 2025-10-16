// ============================================================
// TIPOS DE POSTS - Game of Bones
// ============================================================

/**
 * Tipos posibles de fósiles que puede tener un post.
 * Estos valores se usarán tanto en formularios como en el backend.
 */
export type FossilType =
  | 'bones_teeth'         // Huesos y dientes
  | 'shell_exoskeletons'  // Conchas y exoesqueletos
  | 'plant_impressions'   // Impresiones de plantas
  | 'tracks_traces'       // Huellas y rastros
  | 'amber_insects';      // Insectos en ámbar

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
  image_url?: string;
  discovery_date?: string;      // fecha del hallazgo (ISO string)
  location?: string;            // lugar del hallazgo
  paleontologist?: string;      // nombre del paleontólogo
  fossil_type: FossilType;      // tipo de fósil
  geological_period?: string;   // era o periodo geológico
  status: PostStatus;           // publicado o borrador
  source?: string;              // fuente de información
  author_id: number;            // referencia al usuario autor
  created_at: string;           // fecha de creación
  updated_at: string;           // fecha de actualización

  // Relaciones opcionales (por ejemplo, cuando se incluye info del autor)
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
 * Datos para actualizar un post existente.
 * Todos los campos son opcionales (PATCH-like),
 * excepto los que el backend requiere explícitamente.
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
 * Opciones estáticas para mostrar en selects (menús desplegables)
 * de tipo de fósil dentro del formulario.
 */
export const FOSSIL_TYPE_OPTIONS = [
  { value: 'bones_teeth' as FossilType, label: 'Huesos y Dientes' },
  { value: 'shell_exoskeletons' as FossilType, label: 'Conchas y Exoesqueletos' },
  { value: 'plant_impressions' as FossilType, label: 'Impresiones de Plantas' },
  { value: 'tracks_traces' as FossilType, label: 'Huellas y Rastros' },
  { value: 'amber_insects' as FossilType, label: 'Insectos en Ámbar' },
] as const;
