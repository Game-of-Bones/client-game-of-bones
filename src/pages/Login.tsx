// Página de inicio de sesión

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Hook para la lógica de autenticación
import LoginForm from '../components/ui/LoginForm'; // Importamos el nuevo componente

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
        <LoginForm
          formData={formData}
          isLoading={isLoading}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        {/* Opciones adicionales fuera del componente de formulario */}
        <div className="flex items-center justify-between text-sm">
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
          <a href="#" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;