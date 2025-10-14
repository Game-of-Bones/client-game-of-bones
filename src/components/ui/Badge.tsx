import React from 'react';

/**
 * BADGE COMPONENT - Sistema de Diseño Game of Bones
 * 
 * Componente para mostrar etiquetas de roles y estados
 * con diferentes variantes visuales y tamaños.
 * 
 * @example
 * // Badge de rol admin
 * <Badge variant="admin">Admin</Badge>
 * 
 * @example
 * // Badge de estado publicado (tamaño pequeño)
 * <Badge variant="published" size="sm">Publicado</Badge>
 * 
 * @example
 * // Badge personalizado con className adicional
 * <Badge variant="draft" className="animate-pulse">Borrador</Badge>
 */

// ========================================
// TIPOS Y INTERFACES
// ========================================

/**
 * Variantes disponibles para el Badge
 * - admin: Para usuarios administradores (coral/rojo)
 * - user: Para usuarios normales (verde oliva)
 * - published: Para contenido publicado (verde éxito)
 * - draft: Para contenido en borrador (gris neutro)
 */
type BadgeVariant = 'admin' | 'user' | 'published' | 'draft';

/**
 * Tamaños disponibles para el Badge
 * - sm: Pequeño (útil para listas densas, tablas)
 * - md: Mediano (tamaño por defecto, equilibrado)
 */
type BadgeSize = 'sm' | 'md';

/**
 * Props del componente Badge
 */
interface BadgeProps {
  /** Variante visual del badge (rol o estado) */
  variant: BadgeVariant;
  
  /** Tamaño del badge */
  size?: BadgeSize;
  
  /** Contenido del badge (texto, iconos, etc.) */
  children: React.ReactNode;
  
  /** Clases CSS adicionales para personalización */
  className?: string;
  
  /** Props HTML adicionales del elemento span */
  [key: string]: any;
}

// ========================================
// CONFIGURACIÓN DE ESTILOS
// ========================================

/**
 * Estilos base compartidos por todos los badges
 * - inline-flex: Para alinear contenido horizontal
 * - items-center: Centra verticalmente el contenido
 * - font-medium: Peso de fuente medio para buena legibilidad
 * - rounded-full: Bordes totalmente redondeados (píldora)
 * - transition-colors: Animación suave de colores (útil para hover futuro)
 * - whitespace-nowrap: Evita saltos de línea
 */
const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-colors whitespace-nowrap';

/**
 * Estilos según tamaño
 * 
 * sm: 
 * - px-2: Padding horizontal 8px
 * - py-0.5: Padding vertical 2px
 * - text-xs: Tamaño de texto 12px
 * 
 * md (default):
 * - px-3: Padding horizontal 12px
 * - py-1: Padding vertical 4px
 * - text-sm: Tamaño de texto 14px
 */
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

/**
 * Estilos según variante (colores del sistema de diseño)
 * 
 * Cada variante tiene:
 * - Color de fondo (modo claro)
 * - Color de texto (modo claro)
 * - Color de borde opcional
 * - Versión dark: para el modo oscuro
 * 
 * COLORES BASADOS EN FIGMA:
 * - Admin (coral): #F76C5E - Para llamar atención (rol privilegiado)
 * - User (verde oliva): #6DA49C - Color secundario, amigable
 * - Published (verde éxito): Indica aprobación/disponibilidad
 * - Draft (gris): Estado neutral/temporal
 */
const variantStyles: Record<BadgeVariant, string> = {
  // ROLES
  admin: `
    bg-accent-coral/10 
    text-accent-coral 
    border border-accent-coral/20
    dark:bg-accent-coral/20 
    dark:text-accent-coral 
    dark:border-accent-coral/30
  `,
  
  user: `
    bg-secondary-500/10 
    text-secondary-500 
    border border-secondary-500/20
    dark:bg-secondary-500/20 
    dark:text-secondary-400 
    dark:border-secondary-500/30
  `,
  
  // ESTADOS
  published: `
    bg-green-500/10 
    text-green-700 
    border border-green-500/20
    dark:bg-green-500/20 
    dark:text-green-400 
    dark:border-green-500/30
  `,
  
  draft: `
    bg-gray-500/10 
    text-gray-700 
    border border-gray-500/20
    dark:bg-gray-500/20 
    dark:text-gray-300 
    dark:border-gray-500/30
  `,
};

// ========================================
// COMPONENTE
// ========================================

/**
 * Badge Component
 * 
 * Muestra etiquetas visuales para roles de usuario y estados de contenido.
 * Soporta modo claro/oscuro automáticamente mediante clases Tailwind dark:.
 * 
 * @param variant - Tipo de badge (admin, user, published, draft)
 * @param size - Tamaño del badge (sm, md)
 * @param children - Contenido a mostrar dentro del badge
 * @param className - Clases CSS adicionales
 * @param props - Props HTML adicionales del span
 */
const Badge: React.FC<BadgeProps> = ({ 
  variant, 
  size = 'md', 
  children, 
  className = '',
  ...props 
}) => {
  // Combinar todas las clases CSS
  const badgeClasses = `
    ${baseStyles} 
    ${sizeStyles[size]} 
    ${variantStyles[variant]} 
    ${className}
  `.trim().replace(/\s+/g, ' '); // Limpiar espacios extra

  return (
    <span 
      className={badgeClasses}
      role="status" // Accesibilidad: indica que es un indicador de estado
      aria-label={`${variant} badge`} // Accesibilidad: descripción para screen readers
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

// ========================================
// UTILIDADES Y HELPERS (Opcional - para futuro)
// ========================================

/**
 * Helper para obtener el badge apropiado según el rol del usuario
 * 
 * @example
 * const userBadge = getUserRoleBadge(user.role);
 * return <Badge {...userBadge}>userBadge.label</Badge>
 * 
 * TODO: Implementar cuando se defina el sistema de roles en el backend
 */
export const getUserRoleBadge = (role: string): { variant: BadgeVariant; label: string } => {
  switch (role.toLowerCase()) {
    case 'admin':
    case 'administrator':
      return { variant: 'admin', label: 'Admin' };
    case 'user':
    case 'member':
    default:
      return { variant: 'user', label: 'Usuario' };
  }
};

/**
 * Helper para obtener el badge apropiado según el estado del post
 * 
 * @example
 * const postBadge = getPostStatusBadge(post.status);
 * return <Badge {...postBadge}>{postBadge.label}</Badge>
 * 
 * TODO: Implementar cuando se defina el sistema de estados en el backend
 */
export const getPostStatusBadge = (status: string): { variant: BadgeVariant; label: string } => {
  switch (status.toLowerCase()) {
    case 'published':
    case 'public':
      return { variant: 'published', label: 'Publicado' };
    case 'draft':
    case 'pending':
    default:
      return { variant: 'draft', label: 'Borrador' };
  }
};

// ========================================
// NOTAS PARA FUTURAS IMPLEMENTACIONES
// ========================================

/**
 * TODO: Posibles mejoras futuras
 * 
 * 1. ICONOS:
 *    - Agregar prop opcional `icon` para incluir iconos de lucide-react
 *    - Ejemplo: <Badge variant="admin" icon={Crown}>Admin</Badge>
 * 
 * 2. INTERACTIVIDAD:
 *    - Agregar prop `onClick` para badges clickeables
 *    - Agregar prop `onRemove` para badges removibles (con X)
 *    - Ejemplo: Filtros removibles en búsqueda
 * 
 * 3. ANIMACIONES:
 *    - Badge con animación de pulso para estados "en progreso"
 *    - Ejemplo: <Badge variant="draft" animated>Procesando...</Badge>
 * 
 * 4. NUEVAS VARIANTES:
 *    - 'warning': Para alertas o acciones pendientes (amarillo)
 *    - 'error': Para errores o contenido rechazado (rojo intenso)
 *    - 'info': Para información neutral (azul)
 *    - 'moderator': Si se agrega rol de moderador
 * 
 * 5. ACCESIBILIDAD:
 *    - Mejorar aria-labels según contexto de uso
 *    - Agregar soporte para screen readers con descripciones más detalladas
 * 
 * 6. INTEGRACIÓN CON ZUSTAND:
 *    - Si se necesita estado global para badges (ej: contador de notificaciones)
 *    - Ejemplo: Badge con número dinámico desde el store
 * 
 * 7. TEMAS PERSONALIZADOS:
 *    - Si ThemeContext permite temas personalizados además de claro/oscuro
 *    - Permitir override de colores por tema
 */