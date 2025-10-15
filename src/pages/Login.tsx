// Página de inicio de sesión

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


//Login - Página de inicio de sesión
const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    // Si el estado de autenticación aún está cargando, no hacer nada.
    if (isAuthLoading) {
      return;
    }
    // Si el usuario ya está autenticado, redirigirlo a la página de inicio.
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Estado para manejar errores y loading
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar el error específico del campo cuando el usuario empieza a escribir
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
    }
    // Limpiar el error general del formulario
    if (errors.form) {
      setErrors(prev => ({ ...prev, form: undefined }));
    }
  };

  /**
   * Valida el formulario y actualiza el estado de errores.
   * @returns `true` si el formulario es válido, `false` en caso contrario.
   */
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email es inválido.';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si la validación del frontend falla, no continuar.
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData); // Llama a la función login del contexto
      navigate('/posts'); // Redirige a la página de posts tras un login exitoso

    } catch (err: any) {
      // Manejar diferentes tipos de errores
      if (err.response?.status === 401) {
        setErrors({ form: 'Email o contraseña incorrectos.' });
      } else if (err.response?.status === 500) {
        setErrors({ form: 'Error del servidor. Por favor, intenta más tarde.' });
      } else {
        setErrors({ form: err.message || 'Error al iniciar sesión.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Muestra un estado de carga mientras se verifica la autenticación inicial
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Verificando autenticación...</div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-[var(--bg-card)] rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Iniciar Sesión</h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-[var(--color-coral)] hover:text-[var(--color-teal)] hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Mostrar error general del formulario si existe */}
          {errors.form && (
            <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 text-[var(--color-danger)] px-4 py-3 rounded-lg">
              {errors.form}
            </div>
          )}

          <div className="space-y-4">
            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
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
                className={`input ${errors.email ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:outline-[var(--color-danger)]' : ''}`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-[var(--color-danger)] text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
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
                className={`input ${errors.password ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:outline-[var(--color-danger)]' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-[var(--color-danger)] text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Checkbox "Recordarme" y "Olvidé mi contraseña" */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[var(--color-coral)] focus:ring-[var(--color-coral)] border-[var(--border-color)] rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--text-secondary)]">
                Recordarme
              </label>
            </div>

            {/* TODO: Implementar funcionalidad de "Olvidé mi contraseña" */}
            <div className="text-sm">
              <a href="#" className="font-medium text-[var(--color-coral)] hover:text-[var(--color-teal)] hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full disabled:bg-[var(--bg-hover)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;