// Página de registro de nuevos usuarios

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// TODO: Importar servicios cuando estén disponibles
// import { register } from '../services/authService';
// import { useAuth } from '../hooks/useAuth';

/**
 * Register - Página de registro de usuarios
 * 
 * Funcionalidad:
 * - Formulario con username, email, password y confirmación
 * - Validación de campos (formato email, longitud password, passwords coinciden)
 * - Validación de username disponible (en tiempo real idealmente)
 * - Manejo de errores (email ya existe, servidor caído, etc)
 * - Redireccionamiento tras registro exitoso (a login o auto-login)
 */
const Register = () => {
  const navigate = useNavigate();
  // TODO: Descomentar cuando useAuth esté implementado
  // const { login: authLogin } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Estado para errores y loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Valida el formulario antes de enviar
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar username
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Solo se permiten letras, números y guiones bajos';
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implementar cuando el servicio esté listo
      // const response = await register({
      //   username: formData.username,
      //   email: formData.email,
      //   password: formData.password
      // });
      
      // Opción 1: Auto-login después del registro
      // authLogin(response.token, response.user);
      // navigate('/');
      
      // Opción 2: Redirigir a login con mensaje de éxito
      // navigate('/login', { state: { message: 'Registro exitoso. Inicia sesión.' } });

      // MOCK temporal - ELIMINAR cuando el servicio esté listo
      console.log('Register attempt:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de registro exitoso
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');

    } catch (err: any) {
      // Manejar errores del backend
      if (err.response?.status === 409) {
        // Conflicto: email o username ya existe
        const field = err.response.data.field; // 'email' o 'username'
        setErrors({ [field]: `Este ${field} ya está en uso` });
      } else if (err.response?.status === 400) {
        // Validación fallida en backend
        setErrors(err.response.data.errors || { general: 'Datos inválidos' });
      } else {
        setErrors({ general: 'Error al registrar. Intenta más tarde' });
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
          <h2 className="text-3xl font-bold">Crear Cuenta</h2>
          <p className="mt-2 text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error general */}
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Campo Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Nombre de Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.username
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="usuario123"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

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
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Campo Confirmar Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Términos y condiciones */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Acepto los{' '}
              <a href="#" className="text-blue-600 hover:underline">
                términos y condiciones
              </a>{' '}
              y la{' '}
              <a href="#" className="text-blue-600 hover:underline">
                política de privacidad
              </a>
            </label>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

/**
 * NOTAS DE IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Servicio de registro (src/services/authService.ts):
 *    export const register = async (data: {
 *      username: string;
 *      email: string;
 *      password: string;
 *    }) => {
 *      const response = await fetch('http://localhost:3000/auth/register', {
 *        method: 'POST',
 *        headers: { 'Content-Type': 'application/json' },
 *        body: JSON.stringify(data)
 *      });
 *      
 *      if (!response.ok) {
 *        const error = await response.json();
 *        throw { response: { status: response.status, data: error } };
 *      }
 *      
 *      return await response.json(); // { token, user } o { message }
 *    };
 * 
 * 2. Validación de username disponible en tiempo real:
 *    - Crear endpoint GET /auth/check-username/:username
 *    - Usar debounce para no hacer peticiones en cada tecla
 *    - Mostrar ✓ o ✗ al lado del input mientras el usuario escribe
 *    
 *    const checkUsernameAvailable = async (username: string) => {
 *      const response = await fetch(`/auth/check-username/${username}`);
 *      return response.json(); // { available: boolean }
 *    };
 * 
 * 3. Indicador de fortaleza de contraseña:
 *    - Crear componente PasswordStrength
 *    - Mostrar barra de progreso (débil, media, fuerte)
 *    - Validar: longitud, mayúsculas, números, caracteres especiales
 *    - Usar librería como zxcvbn para calcular fortaleza
 * 
 * 4. Verificación de email:
 *    - Después del registro, enviar email de verificación
 *    - Usuario debe hacer click en link para activar cuenta
 *    - Ruta: GET /auth/verify-email/:token
 *    - Página src/pages/VerifyEmail.tsx
 * 
 * 5. Captcha para prevenir bots:
 *    - Integrar Google reCAPTCHA v3
 *    - Validar en backend antes de crear usuario
 *    - O usar alternativas como hCaptcha
 * 
 * 6. Foto de perfil al registrarse:
 *    - Campo opcional para subir avatar
 *    - O generar avatar automático (iniciales con color random)
 *    - O integrar con Gravatar usando el email
 * 
 * 7. OAuth / Social login:
 *    - Botones para registrarse con Google, GitHub, etc
 *    - Mismo flujo que en Login.tsx
 * 
 * 8. Validación de librería:
 *    - Usar Zod o Yup para esquemas de validación
 *    - Reutilizar esquemas entre frontend y backend
 *    
 *    import { z } from 'zod';
 *    
 *    const registerSchema = z.object({
 *      username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
 *      email: z.string().email(),
 *      password: z.string().min(6),
 *      confirmPassword: z.string()
 *    }).refine(data => data.password === data.confirmPassword, {
 *      message: "Las contraseñas no coinciden",
 *      path: ["confirmPassword"]
 *    });
 */