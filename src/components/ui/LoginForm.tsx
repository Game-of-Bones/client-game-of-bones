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
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Mostrar error general del formulario si existe */}
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.form}
        </div>
      )}

      <div className="space-y-4">
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
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
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
            autoComplete="current-password"
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
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default LoginForm;