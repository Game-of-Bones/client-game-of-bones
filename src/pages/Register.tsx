import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/button';
import { useAuthStore } from '../stores/authStore';

/**
 * REGISTER PAGE - Game of Bones
 * 
 * Página de registro con diseño exacto del Figma.
 * Split-screen: Fósil izquierda, formulario derecha.
 * Respeta el tema claro/oscuro global.
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
    <div className="h-[calc(100vh-88px)] flex overflow-hidden">
      {/* LADO IZQUIERDO - IMAGEN FÓSIL */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src="/shell_fossil.jpg" 
          alt="Fósil de concha" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* LADO DERECHO - FORMULARIO CON FONDO TRANSPARENTE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* LOGO - Clickeable para ir al home - TAMAÑO GRANDE */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex justify-center mb-6 w-full transition-all duration-300 hover:scale-105 focus:outline-none cursor-pointer"
            aria-label="Ir a página principal"
            style={{ outline: 'none', border: 'none' }}
          >
            <img
              src="/gob_logo.png"
              alt="Game of Bones"
              className="w-72 h-auto object-contain pointer-events-none"
              style={{ maxWidth: '300px' }}
            />
          </button>

          {/* HEADER */}
          <div className="text-center mb-6">
            <h1
              className="text-base sm:text-lg mb-2 uppercase"
              style={{ 
                color: '#C9A875',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.08em',
                lineHeight: '1.5',
              }}
            >
              Rellena los datos para crear tu perfil
            </h1>
            <p
              className="text-xs uppercase mb-3"
              style={{ 
                color: '#E8D9B8',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.25em',
              }}
            >
              Registro
            </p>
            {/* Línea horizontal decorativa */}
            <div 
              className="w-full max-w-sm mx-auto"
              style={{
                height: '1px',
                backgroundColor: 'rgba(201, 168, 117, 0.3)',
              }}
            />
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Error del backend */}
            {error && (
              <div
                className="px-4 py-2.5 rounded-lg border text-center"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: '#EF4444',
                  color: '#FEE2E2',
                }}
              >
                <p className="text-xs" style={{ fontFamily: 'Cinzel, serif' }}>
                  {error}
                </p>
              </div>
            )}

            {/* NOMBRE */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs mb-1 uppercase"
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
                className="w-full px-4 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#C9A875] transition-all text-sm"
                style={{ 
                  backgroundColor: '#8B7355',
                  borderColor: validationErrors.username ? '#EF4444' : 'transparent',
                  color: '#FFFFFF',
                  fontFamily: 'Cinzel, serif',
                }}
                autoComplete="username"
                placeholder="Tu nombre de usuario"
              />
              {validationErrors.username && (
                <p className="mt-1 text-xs" style={{ color: '#FCA5A5', fontFamily: 'Cinzel, serif' }}>
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* NOMBRE DE PERFIL (read-only, espejo del username) */}
            <div>
              <label
                htmlFor="username-display"
                className="block text-xs mb-1 uppercase"
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
                className="w-full px-4 py-1.5 rounded-lg border cursor-not-allowed opacity-70 text-sm"
                style={{ 
                  backgroundColor: '#6B5B4A',
                  borderColor: 'transparent',
                  color: '#9CA3AF',
                  fontFamily: 'Cinzel, serif',
                }}
                placeholder="Se generará automáticamente"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs mb-1 uppercase"
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
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#C9A875] transition-all text-sm"
                style={{ 
                  backgroundColor: '#8B7355',
                  borderColor: validationErrors.email ? '#EF4444' : 'transparent',
                  color: '#FFFFFF',
                  fontFamily: 'Cinzel, serif',
                }}
                autoComplete="email"
                placeholder="tu@email.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs" style={{ color: '#FCA5A5', fontFamily: 'Cinzel, serif' }}>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs mb-1 uppercase"
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
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#C9A875] transition-all text-sm"
                style={{ 
                  backgroundColor: '#8B7355',
                  borderColor: validationErrors.password ? '#EF4444' : 'transparent',
                  color: '#FFFFFF',
                  fontFamily: 'Cinzel, serif',
                }}
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs" style={{ color: '#FCA5A5', fontFamily: 'Cinzel, serif' }}>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs mb-1 uppercase"
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
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#C9A875] transition-all text-sm"
                style={{ 
                  backgroundColor: '#8B7355',
                  borderColor: validationErrors.confirmPassword ? '#EF4444' : 'transparent',
                  color: '#FFFFFF',
                  fontFamily: 'Cinzel, serif',
                }}
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: '#FCA5A5', fontFamily: 'Cinzel, serif' }}>
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* BOTÓN DE REGISTRO */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 text-xs font-semibold tracking-widest uppercase transition-all"
                style={{
                  fontFamily: 'Cinzel, serif',
                }}
              >
                {isLoading ? 'REGISTRANDO...' : 'REGISTRAR'}
              </Button>
            </div>

            {/* ENLACE A LOGIN - TODA LA FRASE ES CLICKEABLE */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C9A875] rounded px-2 py-1"
                style={{ 
                  color: '#E8D9B8',
                  fontFamily: 'Cinzel, serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#C9A875';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#E8D9B8';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ¿Estás ya registrado? <span style={{ color: '#D4A574', textDecoration: 'underline' }}>¡Inicia sesión aquí!</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;