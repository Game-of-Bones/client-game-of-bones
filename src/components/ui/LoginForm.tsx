import React from 'react';

/**
 * Props para el componente LoginForm
 */
interface LoginFormProps {
  formData: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  errors: {
    email?: string;
    password?: string;
    form?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

/**
 * LoginForm - Componente presentacional para el formulario de inicio de sesión.
 * No contiene lógica de negocio, solo renderiza la UI basado en las props.
 */
const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  isLoading,
  errors,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Mostrar error general del formulario si existe */}
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          {errors.form}
        </div>
      )}

      {/* Campo Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-theme-primary">
          Email
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`input ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-theme'}`}
            placeholder="tu@email.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Campo Password */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-theme-primary">
            Contraseña
          </label>
          <div className="text-sm">
            {/* TODO: Implementar funcionalidad de "Olvidé mi contraseña" */}
            <a href="#" className="font-semibold text-accent-coral hover:text-accent-teal">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-theme'}`}
            placeholder="••••••••"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Botón Submit */}
      <div>
        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;