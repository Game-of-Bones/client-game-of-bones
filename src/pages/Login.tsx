// Página de inicio de sesión

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// TODO: Importar servicios de autenticación cuando estén disponibles
// import { login } from '../services/authService';
// import { useAuth } from '../hooks/useAuth';

/**
 * Login - Página de inicio de sesión
 * 
 * Funcionalidad:
 * - Formulario con email/username y password
 * - Validación de campos
 * - Manejo de errores (credenciales incorrectas, servidor caído, etc)
 * - Redireccionamiento tras login exitoso
 */
const Login = () => {
  const navigate = useNavigate();
  // TODO: Descomentar cuando useAuth esté implementado
  // const { login: authLogin } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Estado para manejar errores y loading
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación básica
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implementar cuando el servicio de auth esté listo
      // const response = await login(formData.email, formData.password);
      // authLogin(response.token, response.user);
      
      // MOCK temporal - ELIMINAR cuando el servicio esté listo
      console.log('Login attempt:', formData);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulación de login exitoso
      // navigate('/'); // Redirigir a home tras login exitoso
      
      // Simulación de error para testing
      throw new Error('Credenciales incorrectas');
      
    } catch (err: any) {
      // Manejar diferentes tipos de errores
      if (err.response?.status === 401) {
        setError('Email o contraseña incorrectos');
      } else if (err.response?.status === 500) {
        setError('Error del servidor. Intenta más tarde');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
          <p className="mt-2 text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Mostrar error si existe */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
              />
            </div>

            {/* Campo Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Checkbox "Recordarme" y "Olvidé mi contraseña" */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Recordarme
              </label>
            </div>

            {/* TODO: Implementar funcionalidad de "Olvidé mi contraseña" */}
            <div className="text-sm">
              <a href="#" className="text-blue-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* TODO: Agregar opción de login con redes sociales */}
        {/*
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full py-2 border rounded hover:bg-gray-50">
              Google
            </button>
            <button className="w-full py-2 border rounded hover:bg-gray-50">
              GitHub
            </button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default Login;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Servicio de autenticación (src/services/authService.ts):
 *    export const login = async (email: string, password: string) => {
 *      const response = await fetch('http://localhost:3000/auth/login', {
 *        method: 'POST',
 *        headers: { 'Content-Type': 'application/json' },
 *        body: JSON.stringify({ email, password })
 *      });
 *      
 *      if (!response.ok) throw new Error('Login failed');
 *      const data = await response.json();
 *      return data; // { token, user }
 *    };
 * 
 * 2. Guardar token después del login:
 *    localStorage.setItem('token', response.token);
 *    localStorage.setItem('user', JSON.stringify(response.user));
 * 
 * 3. Funcionalidad "Recordarme":
 *    - Si está marcado, guardar en localStorage
 *    - Si no, guardar en sessionStorage (se borra al cerrar navegador)
 * 
 * 4. Recuperar contraseña:
 *    - Crear página src/pages/ForgotPassword.tsx
 *    - Endpoint en backend: POST /auth/forgot-password
 *    - Enviar email con token para resetear contraseña
 * 
 * 5. Validación mejorada:
 *    - Usar una librería como Yup o Zod para validación de esquemas
 *    - Validar formato de email antes de enviar
 *    - Mostrar errores específicos por campo
 * 
 * 6. OAuth (login con redes sociales):
 *    - Implementar Google OAuth
 *    - Implementar GitHub OAuth
 *    - Requiere configuración en backend y credenciales de API
 * 
 * 7. Redirección inteligente:
 *    - Si el usuario vino de una ruta protegida, redirigir ahí después del login
 *    - Usar useLocation() para obtener el "from" state
 * 
 * 8. Rate limiting:
 *    - Limitar intentos de login (máximo 5 en 15 minutos)
 *    - Mostrar captcha después de X intentos fallidos
 */