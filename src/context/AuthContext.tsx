import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider ahora actúa como un inicializador.
 * Su única responsabilidad es llamar a `checkAuth` del store de Zustand
 * una sola vez cuando la aplicación se monta.
 *
 * Ya no provee un contexto, ya que el estado es global gracias a Zustand.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Usamos `useRef` para asegurarnos de que la verificación se ejecute solo una vez.
  const didCheckAuth = useRef(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!didCheckAuth.current) {
      didCheckAuth.current = true;
      checkAuth();
    }
  }, [checkAuth]);
  
  // Mantenemos una pantalla de carga inicial mientras se verifica el token.
  if (isLoading) {
    return <div>Cargando autenticación...</div>;
  }

  return <>{children}</>;
};

// Ya no exportamos el contexto, ya que no se usará directamente.
// Los componentes usarán un hook `useAuth` que consumirá el store de Zustand.
