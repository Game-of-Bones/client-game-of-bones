import { useAuthStore } from '../stores/authStore';

/**
 * Hook personalizado para acceder al estado y acciones de autenticación
 * desde el store de Zustand.
 *
 * Proporciona una API limpia y centralizada para que los componentes
 * interactúen con la lógica de autenticación, sin acoplarlos directamente
 * a la implementación de Zustand.
 *
 * @returns El estado completo y las acciones del store de autenticación.
 */
export const useAuth = () => {
  // El hook simplemente devuelve el resultado de llamar al hook del store.
  // Se pueden usar selectores aquí para optimizar si es necesario.
  const authData = useAuthStore();
  return authData;
};