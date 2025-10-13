# Notas de Integración - AuthContext

## ✅ Completado

### AuthContext (Issue #5)
- [x] Tipos TypeScript (`src/types/auth.types.ts`)
- [x] Servicio de autenticación con MOCK (`src/services/authService.ts`)
- [x] Context y Provider (`src/context/AuthContext.tsx`)
- [x] Hook useAuth (`src/hooks/useAuth.ts`)
- [x] Integración en `main.tsx`
- [x] ProtectedRoute actualizado para usar useAuth
- [x] AdminRoute creado desde cero

---

## ⚠️ Pendiente para Backend

### Cuando el backend esté listo:

**Archivo a modificar:** `src/services/authService.ts`

**Cambios necesarios:**

1. Eliminar todo el código MOCK (usuarios hardcodeados, delays)
2. Reemplazar por llamadas reales a apiService:
```
import apiService from './api/apiService';
import type { LoginCredentials, RegisterData, User } from '../types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiService.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await apiService.post('/auth/register', data);
    return response.data;
  }

  async verifyToken(): Promise<User> {
    const response = await apiService.get('/auth/verify');
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

export default new AuthService();
´´´
El router ya está parcialmente implementado, pero necesita:

Verificar imports en router/router.tsx:

ProtectedRoute ya usa useAuth ✅
AdminRoute ya creado ✅


Páginas que faltan crear:

Login.tsx
Register.tsx
Profile.tsx
NotFound.tsx
Otras páginas referenciadas en el router


Testing del flujo completo:

Usuario no autenticado intenta acceder a ruta protegida → Redirige a /login
Usuario autenticado (no admin) intenta acceder a ruta admin → Redirige a /
Usuario admin accede a ruta admin → Funciona correctamente

📋 Usuarios de Prueba (MOCK)
Mientras el backend no esté listo, usar estos usuarios:
Admin:

Email: admin@gameofbones.com
Password: admin123

User:

Email: user@gameofbones.com
Password: user123

