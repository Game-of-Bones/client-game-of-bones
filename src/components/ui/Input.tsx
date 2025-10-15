import React, { forwardRef, type InputHTMLAttributes } from 'react';

/**
 * Input Component - Sistema de Diseño DinoPress
 * 
 * SUBISSUE #35: Input con label, error, helper text
 * 
 * Características implementadas:
 * ✅ Estados: default, error, disabled, focus
 * ✅ Compatible con react-hook-form (forwardRef)
 * ✅ Accesibilidad completa (ARIA labels, asociaciones)
 * ✅ Label, helper text y mensajes de error
 * ✅ Responsive y adaptado a la paleta de colores
 * ✅ Integrado con ThemeContext (modo claro/oscuro)
 * 
 * TODO para futuras implementaciones:
 * - [ ] Añadir variantes de tamaño (sm, md, lg) si se requiere
 * - [ ] Implementar input de tipo "password" con toggle show/hide
 * - [ ] Añadir iconos a la izquierda/derecha (usando lucide-react)
 * - [ ] Integrar con Zod validation si el equipo lo decide
 * 
 * Uso con react-hook-form:
 * ```tsx
 * const { register, formState: { errors } } = useForm();
 * 
 * <Input
 *   label="Email"
 *   type="email"
 *   error={errors.email?.message}
 *   {...register('email')}
 * />
 * ```
 */

// Interfaz de props extendiendo los atributos nativos de input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Texto del label que se muestra encima del input */
  label?: string;
  
  /** Mensaje de error a mostrar debajo del input (activará el estado de error) */
  error?: string;
  
  /** Texto de ayuda que se muestra debajo del input cuando no hay error */
  helperText?: string;
  
  /** ID único del input (necesario para accesibilidad) */
  id?: string;
  
  /** Clases CSS adicionales para el contenedor principal */
  containerClassName?: string;
  
  /** Clases CSS adicionales para el input */
  className?: string;
}

/**
 * Componente Input con forwardRef para compatibilidad con react-hook-form
 * 
 * IMPORTANTE: forwardRef permite que react-hook-form maneje el ref del input
 * directamente, lo cual es necesario para el registro y validación.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      id,
      containerClassName = '',
      className = '',
      disabled = false,
      required = false,
      type = 'text',
      ...rest // Resto de props nativas de input (onChange, onBlur, etc.)
    },
    ref
  ) => {
    // Generar un ID único si no se proporciona (necesario para accesibilidad)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // IDs para asociar el input con sus textos descriptivos (accesibilidad)
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    
    /**
     * ESTILOS BASE
     * Colores basados en el documento de la issue:
     * - Modo claro: Tonos beige/marrón (#AA7B5C, #F5EBC8)
     * - Modo oscuro: Se aplican automáticamente vía Tailwind dark: modifier
     * 
     * NOTA: Estos estilos usan dark: de Tailwind que se activa con la clase
     * 'dark' en el <html>, que ya está implementada en ThemeContext.tsx
     */
    const baseStyles = `
      w-full px-4 py-2.5 rounded-lg
      border-2 transition-all duration-200
      font-sans text-base
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      focus:outline-none focus:ring-2 focus:ring-offset-2
      dark:focus:ring-offset-gray-900
    `;
    
    /**
     * ESTILOS CONDICIONALES según el estado
     * 
     * Estados implementados con soporte para dark mode:
     * 1. Error: borde rojo, texto rojo, ring rojo en focus
     * 2. Disabled: opacidad reducida, cursor no permitido, fondo gris
     * 3. Default/Focus: borde marrón (primary-300), ring marrón en focus
     * 
     * Cada estado tiene su equivalente para modo oscuro usando dark:
     */
    const stateStyles = error
      ? // Estado ERROR (igual en light y dark, el rojo es universal)
        'border-red-500 text-red-900 bg-red-50 focus:ring-red-500 dark:bg-red-950 dark:text-red-200 dark:border-red-600'
      : disabled
      ? // Estado DISABLED
        'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
      : // Estado DEFAULT y FOCUS
        `border-[#AA7B5C] bg-white text-gray-900 
         hover:border-[#8B6543] focus:ring-[#AA7B5C]
         dark:bg-[#2d2419] dark:text-[#F5EBC8] 
         dark:border-[#8B6543] dark:hover:border-[#AA7B5C]`;
    
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {/* LABEL */}
        {label && (
          <label
            htmlFor={inputId}
            className={`
              text-sm font-medium text-gray-700 dark:text-[#F5EBC8]
              ${required ? "after:content-['*'] after:ml-1 after:text-red-500" : ''}
              ${disabled ? 'opacity-60' : ''}
            `}
          >
            {label}
          </label>
        )}
        
        {/* INPUT */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={`${baseStyles} ${stateStyles} ${className}`}
          /**
           * ACCESIBILIDAD (ARIA):
           * - aria-invalid: indica si el input tiene un error
           * - aria-describedby: asocia el input con los textos de ayuda/error
           * - aria-required: indica si el campo es obligatorio
           */
          aria-invalid={!!error}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          aria-required={required}
          {...rest}
        />
        
        {/* MENSAJE DE ERROR */}
        {error && (
          <p
            id={errorId}
            className="text-sm text-red-600 dark:text-red-400 flex items-start gap-1"
            /**
             * ACCESIBILIDAD:
             * - role="alert": anuncia el error a lectores de pantalla
             * - aria-live="polite": actualiza sin interrumpir al usuario
             */
            role="alert"
            aria-live="polite"
          >
            {/* TODO: Cambiar por icono de lucide-react cuando se integre */}
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </p>
        )}
        
        {/* HELPER TEXT (solo se muestra si no hay error) */}
        {!error && helperText && (
          <p
            id={helperId}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Nombre para React DevTools (debugging)
Input.displayName = 'Input';

export default Input;

/**
 * ============================================================
 * EJEMPLO DE USO - Para testing y documentación
 * ============================================================
 */

// Ejemplo standalone (sin formulario)
export function InputExample() {
  const [value, setValue] = React.useState('');
  
  return (
    <div className="p-8 space-y-6 max-w-md bg-white dark:bg-[#1a1410] min-h-screen">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F5EBC8]">
          Input - Ejemplos de Estados
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Los inputs se adaptan automáticamente al tema (claro/oscuro) usando ThemeContext
        </p>
      </div>
      
      {/* Estado DEFAULT */}
      <Input
        label="Nombre completo"
        placeholder="Escribe tu nombre..."
        helperText="Como aparecerá en tu perfil"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      
      {/* Estado con REQUIRED */}
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        required
        helperText="Necesario para recuperar tu contraseña"
      />
      
      {/* Estado ERROR */}
      <Input
        label="Contraseña"
        type="password"
        placeholder="Mínimo 8 caracteres"
        error="La contraseña debe tener al menos 8 caracteres"
      />
      
      {/* Estado DISABLED */}
      <Input
        label="Usuario"
        value="dinoreporter"
        disabled
        helperText="El nombre de usuario no se puede cambiar"
      />
      
      <div className="mt-8 p-4 bg-gray-100 dark:bg-[#2d2419] rounded-lg">
        <p className="text-sm text-gray-700 dark:text-[#F5EBC8]">
          💡 <strong>Tip:</strong> Cambia el tema con el ThemeToggle para ver cómo 
          los inputs se adaptan automáticamente entre modo claro y oscuro.
        </p>
      </div>
      
      {/* TODO: Ejemplo con react-hook-form
       * Descomenta cuando se implemente el formulario de registro/login
       * 
       * import { useForm } from 'react-hook-form';
       * 
       * const { register, formState: { errors } } = useForm();
       * 
       * <Input
       *   label="Email"
       *   type="email"
       *   error={errors.email?.message}
       *   {...register('email', {
       *     required: 'El email es obligatorio',
       *     pattern: {
       *       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
       *       message: 'Email inválido'
       *     }
       *   })}
       * />
       */}
    </div>
  );
}