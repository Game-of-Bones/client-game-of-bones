export type FossilType = 
  | 'bones_teeth'
  | 'shell_exoskeletons'
  | 'plant_impressions'
  | 'tracks_traces'
  | 'amber_insects';

export type PostStatus = 'draft' | 'published';

/**
 * Estructura completa de un post recibido desde el backend.
 * ✅ BACKEND USA "summary" PARA TODO EL CONTENIDO
 */
export interface Post {
  id: number;
  title: string;
  summary: string; // ✅ Contiene TODO el contenido (resumen + detalle)
  image_url?: string;
  discovery_date?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  paleontologist?: string;
  fossil_type: FossilType;
  geological_period?: string;
  status: PostStatus;
  source?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones opcionales
  author?: {
    id: number;
    username: string;
    email: string;
  };
  
  // ✅ HELPER: Para separar el contenido en el frontend
  post_content?: string; // No existe en backend, lo calculamos nosotros
}

/**
 * Datos requeridos para crear un nuevo post.
 * ✅ BACKEND SOLO ACEPTA "summary"
 */
export interface CreatePostData {
  title: string;
  summary: string; // ✅ Aquí va TODO: resumen + contenido detallado
  image_url?: string;
  discovery_date?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  paleontologist?: string;
  fossil_type: FossilType;
  geological_period?: string;
  status: PostStatus;
  source?: string;
  user_id: number;
}

/**
 * Datos para actualizar un post existente
 */
export interface UpdatePostData {
  title?: string;
  summary?: string; // Contiene TODO el contenido(summary+postdetail)
  image_url?: string;
  discovery_date?: string | null;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
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

// ✅ HELPER: Separa el summary en dos partes para mostrar en el frontend
export function splitPostContent(summary: string): { shortSummary: string; detailedContent: string } {
  // Si el summary tiene doble salto de línea, separamos
  const parts = summary.split('\n\n');
  
  if (parts.length >= 2) {
    return {
      shortSummary: parts[0],
      detailedContent: parts.slice(1).join('\n\n')
    };
  }
  
  // Si no hay separación, el summary es tanto resumen como contenido
  return {
    shortSummary: summary,
    detailedContent: summary
  };
}