// Página de inicio de sesión

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Hook para la lógica de autenticación
import LoginForm from '../components/ui/LoginForm'; // Importamos el nuevo componente

//Login - Página de inicio de sesión
const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Obtener la ubicación para la redirección inteligente
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Si el estado de autenticación aún está cargando, no hacer nada.
    if (isAuthLoading) {
      return;
    }
    // Si el usuario ya está autenticado, redirigirlo.
    if (isAuthenticated) {
      // Redirige a la página que intentaba visitar o a la página de inicio.
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate, from]);

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
      navigate(from, { replace: true }); // Redirige a la página original o a la de inicio

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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* TODO: Reemplazar con el logo del proyecto */}
        <img
          alt="Game of Bones Logo"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-theme-primary">
          Iniciar Sesión
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm card p-8">
        {/* Formulario */}
        <LoginForm
          formData={formData}
          isLoading={isLoading}
          errors={errors}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        <p className="mt-10 text-center text-sm text-theme-secondary">
            ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-accent-coral hover:text-accent-teal">
              Regístrate aquí
            </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;