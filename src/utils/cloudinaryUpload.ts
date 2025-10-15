/**
 * CLOUDINARY UPLOAD UTILITY - Game of Bones
 * 
 * Utilidad para subir imágenes a Cloudinary desde el frontend
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

/**
 * Subir imagen a Cloudinary
 * @param file - Archivo de imagen a subir
 * @returns URL segura de la imagen subida
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  // Validar que las credenciales estén configuradas
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary no está configurado. Verifica tu archivo .env'
    );
  }

  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error(
      'Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)'
    );
  }

  // Validar tamaño (máximo 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error(
      'La imagen es demasiado grande. El tamaño máximo es 10MB'
    );
  }

  // Crear FormData para enviar
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'game-of-bones/posts'); // Opcional: organizar en carpetas

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al subir la imagen');
    }

    const data: CloudinaryResponse = await response.json();
    return data.secure_url;
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(
      error.message || 'Error al subir la imagen a Cloudinary'
    );
  }
}

/**
 * Validar que una URL sea de Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

/**
 * Extraer public_id de una URL de Cloudinary
 * Útil si necesitas eliminar la imagen después
 */
export function extractPublicId(cloudinaryUrl: string): string | null {
  try {
    const matches = cloudinaryUrl.match(/\/v\d+\/(.+)\.\w+$/);
    return matches ? matches[1] : null;
  } catch {
    return null;
  }
}