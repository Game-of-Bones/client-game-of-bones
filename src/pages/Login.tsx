// Página de inicio de sesión

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/ui/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Obtener la ubicación para la redirección inteligente
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

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

    console.log('📧 Datos enviados:', formData);
    setIsLoading(true);
    setErrors({}); // Limpiar errores previos

    try {
      await login(formData);
      // Solo después de un login exitoso, navegar
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('❌ Error completo:', err); 
      // Manejar diferentes tipos de errores
      if (err.response?.status === 401) {
        setErrors({ form: 'Email o contraseña incorrectos.' });
      } else if (err.response?.status === 500) {
        setErrors({ form: 'Error del servidor. Por favor, intenta más tarde.' });
      } else {
        setErrors({ form: err.message || 'Error al iniciar sesión.' });
      }
      setIsLoading(false); // Solo poner en false si hay error
    }
    // NO hay finally - si el login es exitoso, la navegación ocurre inmediatamente
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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