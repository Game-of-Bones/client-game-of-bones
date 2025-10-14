import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/button';
import { useAuthStore } from '../stores/authStore';

/**
 * REGISTER PAGE - Game of Bones
 * 
 * Página de registro con diseño exacto del Figma.
 * Split-screen: Fósil izquierda, formulario derecha.
 */

const Register = () => {
  const navigate = useNavigate();
  
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'Mínimo 3 caracteres';
    } else if (formData.username.length > 20) {
      errors.username = 'Máximo 20 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Solo letras, números y guiones bajos';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      console.error('Error en registro:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] flex">
      {/* LADO IZQUIERDO - IMAGEN FÓSIL */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="/shell_fossil.jpg" 
          alt="Fósil de concha" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* LADO DERECHO - FORMULARIO */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
        style={{ backgroundColor: '#5D4A3A' }}
      >
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="flex justify-center mb-10">
            <img
              src="/gob_logo.png"
              alt="Game of Bones"
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1
              className="text-lg sm:text-xl mb-3"
              style={{ 
                color: '#C9A875',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.08em',
                lineHeight: '1.5',
                textTransform: 'uppercase',
              }}
            >
              Rellena los datos para crear tu perfil
            </h1>
            <p
              className="text-sm uppercase mb-4"
              style={{ 
                color: '#E8D9B8',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.25em',
              }}
            >
              Registro
            </p>
            {/* Línea horizontal */}
            <div 
              className="w-full max-w-sm mx-auto"
              style={{
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
              }}
            />
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error del backend */}
            {error && (
              <div
                className="px-4 py-3 rounded border text-center"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: '#EF4444',
                  color: '#FEE2E2',
                }}
              >
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* NOMBRE */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs mb-2 uppercase"
                style={{ 
                  color: '#C9A875',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.15em',
                }}
              >
                Nombre
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: '#8B7355',
                  borderColor: validationErrors.username ? '#EF4444' : 'transparent',
                  color: '#FFFFFF',
                  fontFamily: 'Cinzel, serif',
                }}
                autoComplete="username"
              />
              {validationErrors.username && (
                <p className="mt-1 text-xs" style={{ color: '#FCA5A5' }}>
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* NOMBRE DE PERFIL */}
            <div>
              <label
                htmlFor="username-display"
                className="block text-xs mb-2 uppercase"
                style={{ 
                  color: '#C9A875',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.15em',
                }}
              >
                Nombre de perfil
              </label>
              <input
                id="username-display"
                type="text"
                value={formData.username || ''}
                readOnly
                className="w-full px-4 py-2.5 rounded border cursor-not-allowed opacity-70"
                style={{ 
                  backgroundColor: '#6B5B4A',
                  borderColor: 'transparent',
                  color: '#9CA3AF',
                  fontFamily: 'Cinzel, serif',
                }}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs mb-2 uppercase"
                style={{ 
                  color: '#C9A875',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.15em',
                }}
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: '#8B7355',
                  borderColor: validationErrors.email ? '#EF4444' : 'transparent',
                  color: '#FFFFFF',
                  fontFamily: 'Cinzel, serif',
                }}
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs" style={{ color: '#FCA5A5' }}>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs mb-2 uppercase"
                style={{ 
                  color: '#C9A875',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.15em',
                }}
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: '#8B7355',
                  borderColor: validationErrors.password ? '#EF4444' : 'transparent',
                  color: '#FFFFFF',
                  fontFamily: 'Cinzel, serif',
                }}
                autoComplete="new-password"
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs" style={{ color: '#FCA5A5' }}>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs mb-2 uppercase"
                style={{ 
                  color: '#C9A875',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.15em',
                }}
              >
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded border focus:outline-none transition-colors"
                style={{ 
                  backgroundColor: '#8B7355',
                  borderColor: validationErrors.confirmPassword ? '#EF4444' : 'transparent',
                  color: '#FFFFFF',
                  fontFamily: 'Cinzel, serif',
                }}
                autoComplete="new-password"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: '#FCA5A5' }}>
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* BOTÓN */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'REGISTRANDO...' : 'REGISTRAR'}
              </Button>
            </div>

            {/* ENLACE A LOGIN */}
            <div className="text-center pt-4">
              <p
                className="text-sm"
                style={{ 
                  color: '#E8D9B8',
                  fontFamily: 'Cinzel, serif',
                }}
              >
                ¿Estás ya registrado?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="underline hover:text-[#C9A875] transition-colors"
                  style={{ 
                    color: '#D4A574',
                    fontFamily: 'Cinzel, serif',
                  }}
                >
                  ¡Inicia sesión aquí!
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;