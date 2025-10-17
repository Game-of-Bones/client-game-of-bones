import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const from = location.state?.from?.pathname || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Limpiar errores al desmontar
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

    // Limpiar error de validación local
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Limpiar error del backend
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
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
      await login(formData);
      // Si llega aquí, el login fue exitoso
      // authStore ya redirige automáticamente si isAuthenticated cambia
    } catch (err) {
      // El error ya está en el store (authStore.error)
      console.error('Error en login:', err);
    }
  };

  return (
    <div className="h-[calc(100vh-88px)] flex overflow-hidden">
      {/* LADO IZQUIERDO - IMAGEN FÓSIL */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src="/public/hand.jpg" 
          alt="Fósil de concha" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* LADO DERECHO - FORMULARIO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex justify-center mb-6 w-full transition-all duration-300 hover:scale-105"
            aria-label="Ir a página principal"
          >
            <img
              src="/gob_logo.png"
              alt="Game of Bones"
              className="w-72 h-auto object-contain"
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
              }}
            >
              Bienvenido de nuevo
            </h1>
            <p
              className="text-xs uppercase mb-3"
              style={{ 
                color: '#E8D9B8',
                fontFamily: 'Cinzel, serif',
                letterSpacing: '0.25em',
              }}
            >
              Inicio de sesión
            </p>
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

            {/* Estilos para sobrescribir Input */}
            <style>{`
              .login-input-wrapper label {
                color: #C9A875 !important;
                font-family: 'Cinzel', serif !important;
                font-size: 0.75rem !important;
                text-transform: uppercase !important;
                letter-spacing: 0.15em !important;
                margin-bottom: 0.25rem !important;
              }
              
              .login-input-wrapper input {
                background-color: #8B7355 !important;
                border-color: transparent !important;
                color: #FFFFFF !important;
                font-family: 'Cinzel', serif !important;
                font-size: 0.875rem !important;
                padding: 0.5rem 1rem !important;
              }
              
              .login-input-wrapper input::placeholder {
                color: rgba(255, 255, 255, 0.6) !important;
              }
              
              .login-input-wrapper input:focus {
                ring-color: #C9A875 !important;
                border-color: #C9A875 !important;
              }
              
              .login-input-wrapper p[role="alert"] {
                color: #FCA5A5 !important;
                font-family: 'Cinzel', serif !important;
                font-size: 0.75rem !important;
              }
            `}</style>

            {/* EMAIL */}
            <div className="login-input-wrapper">
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
            <div className="login-input-wrapper">
              <Input
                id="password"
                name="password"
                type="password"
                label="Contraseña"
                value={formData.password}
                onChange={handleChange}
                error={validationErrors.password}
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
            </div>

            {/* BOTÓN */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                {isLoading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
              </Button>
            </div>

            {/* ENLACE A REGISTRO */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-sm transition-all duration-200 hover:scale-105"
                style={{ 
                  color: '#E8D9B8',
                  fontFamily: 'Cinzel, serif',
                }}
              >
                ¿No tienes cuenta? <span style={{ color: '#D4A574', textDecoration: 'underline' }}>Regístrate aquí</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;