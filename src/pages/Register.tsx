import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';

/**
 * REGISTER PAGE - Game of Bones
 * 
 * Página de registro con diseño exacto del Figma.
 * Split-screen: Fósil izquierda, formulario derecha.
 * Respeta el tema claro/oscuro global.
 * 
 * ACTUALIZADO: Usa el componente Input del sistema de diseño
 */

const Register = () => {
  const navigate = useNavigate();
  
  const { register, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
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

    if (!formData.displayName.trim()) {
      errors.displayName = 'El nombre de perfil es requerido';
    } else if (formData.displayName.length < 3) {
      errors.displayName = 'Mínimo 3 caracteres';
    } else if (formData.displayName.length > 50) {
      errors.displayName = 'Máximo 50 caracteres';
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
          {/* LOGO - Clickeable para ir al home */}
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
          <form onSubmit={handleSubmit} className="space-y-3">
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

            {/* Wrapper para sobreescribir estilos del Input con tema de Register */}
            <style>{`
              .register-input-wrapper label {
                color: #C9A875 !important;
                font-family: 'Cinzel', serif !important;
                font-size: 0.75rem !important;
                text-transform: uppercase !important;
                letter-spacing: 0.15em !important;
                margin-bottom: 0.25rem !important;
              }
              
              .register-input-wrapper input {
                background-color: #8B7355 !important;
                border-color: transparent !important;
                color: #FFFFFF !important;
                font-family: 'Cinzel', serif !important;
                font-size: 0.875rem !important;
                padding: 0.5rem 1rem !important;
              }
              
              .register-input-wrapper input::placeholder {
                color: rgba(255, 255, 255, 0.6) !important;
              }
              
              .register-input-wrapper input:focus {
                ring-color: #C9A875 !important;
                border-color: #C9A875 !important;
              }
              
              .register-input-wrapper p[role="alert"] {
                color: #FCA5A5 !important;
                font-family: 'Cinzel', serif !important;
                font-size: 0.75rem !important;
              }
              
              /* Modo oscuro - ajustes específicos */
              [data-theme="dark"] .register-input-wrapper input {
                background-color: #6B5B4A !important;
                color: #FAF2E5 !important;
              }
              
              [data-theme="dark"] .register-input-wrapper label {
                color: #E8D9B8 !important;
              }
            `}</style>

            {/* NOMBRE DE USUARIO */}
            <div className="register-input-wrapper">
              <Input
                id="username"
                name="username"
                type="text"
                label="Nombre"
                value={formData.username}
                onChange={handleChange}
                error={validationErrors.username}
                placeholder="Tu nombre de usuario"
                autoComplete="username"
              />
            </div>

            {/* NOMBRE DE PERFIL */}
            <div className="register-input-wrapper">
              <Input
                id="displayName"
                name="displayName"
                type="text"
                label="Nombre de perfil"
                value={formData.displayName}
                onChange={handleChange}
                error={validationErrors.displayName}
                placeholder="Tu nombre para mostrar"
                autoComplete="name"
              />
            </div>

            {/* EMAIL */}
            <div className="register-input-wrapper">
              <Input
                id="email"
                name="email"
                type="email"
                label="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                error={validationErrors.email}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            {/* CONTRASEÑA */}
            <div className="register-input-wrapper">
              <Input
                id="password"
                name="password"
                type="password"
                label="Contraseña"
                value={formData.password}
                onChange={handleChange}
                error={validationErrors.password}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div className="register-input-wrapper">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={validationErrors.confirmPassword}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
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

            {/* ENLACE A LOGIN */}
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