import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider - Inicializador de autenticación
 * 
 * Su única responsabilidad es verificar el token almacenado
 * UNA SOLA VEZ cuando la aplicación se monta.
 * 
 * Después de la verificación inicial, nunca más muestra pantalla de carga.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const didCheckAuth = useRef(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!didCheckAuth.current) {
      didCheckAuth.current = true;
      
      // Ejecutar checkAuth y marcar como completo
      checkAuth().finally(() => {
        setInitialCheckComplete(true);
      });
    }
  }, [checkAuth]);
  
  /**
   * Mostrar pantalla de carga SOLO durante la verificación inicial
   * Después de eso, aunque isLoading cambie (por login/register),
   * ya no bloqueamos toda la app.
   */
  if (!initialCheckComplete && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#5D4A3A]">
        <div className="text-center">
          <img 
            src="/gob_logo.png" 
            alt="Game of Bones Logo" 
            className="h-24 w-auto mx-auto mb-4 animate-pulse"
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="text-[#E8D9B8] text-lg">Cargando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};