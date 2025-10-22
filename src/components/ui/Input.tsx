import React, { forwardRef, type InputHTMLAttributes } from 'react';

/**
 * Input Component - Sistema de Diseño DinoPress
 * * MODIFICACIÓN: Se añaden 'inputClass' (antes 'className') y 'labelHidden' para
 * dar mayor control de estilo y visibilidad desde componentes padres.
 * * ... [El resto de la documentación se mantiene] ...
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
    
    /** Clases CSS adicionales para el input (Anteriormente 'className') */
    inputClass?: string; 

    /**
     * Oculta el label visualmente pero lo mantiene para accesibilidad (aria-label).
     * Por defecto es false.
     */
    labelHidden?: boolean;
}

/**
 * Componente Input con forwardRef para compatibilidad con react-hook-form
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            id,
            containerClassName = '',
            inputClass = '', // Renombrado de 'className' a 'inputClass'
            labelHidden = false, // Nueva propiedad
            disabled = false,
            required = false,
            type = 'text',
            // Usamos 'className' para renombrar el prop que llega desde el padre
            // y que será aplicado directamente al input
            className: userProvidedClass, // Capturamos 'className' si se pasa
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
         */
        const stateStyles = error
            ? // Estado ERROR 
              'border-red-500 text-red-900 bg-red-50 focus:ring-red-500 dark:bg-red-950 dark:text-red-200 dark:border-red-600'
            : disabled
            ? // Estado DISABLED
              'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
            : // Estado DEFAULT y FOCUS
              `border-[#AA7B5C] bg-white text-gray-900 
              hover:border-[#8B6543] focus:ring-[#AA7B5C]
              dark:bg-[#2d2419] dark:text-[#F5EBC8] 
              dark:border-[#8B6543] dark:hover:border-[#AA7B5C]`;
        
        // Determinar las clases finales del input
        const finalInputClasses = `${baseStyles} ${stateStyles} ${inputClass} ${userProvidedClass || ''}`;

        return (
            <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
                {/* LABEL - Oculto si labelHidden es true */}
                {label && !labelHidden && (
                    <label
                        htmlFor={inputId}
                        className={`
                            text-sm font-medium text-gray-700 dark:text-[#F5EBC8]
                            ${required ? "after:content-['*'] after:ml-1 after:text-red-500" : ''}
                            ${disabled ? 'opacity-60' : ''}
                            uppercase
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
                    className={finalInputClasses} // Usar las clases finales
                    /**
                     * ACCESIBILIDAD (ARIA): 
                     * Si el label está oculto, debemos usar aria-label para describir el input.
                     */
                    aria-label={labelHidden && label ? label : undefined}
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
                    Los inputs se adaptan automáticamente al tema (claro/oscuro).
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
                // Ejemplo de uso de inputClass
                inputClass="border-blue-500 font-semibold" 
            />

            {/* Ejemplo con Label Oculto (ideal para inputs de URL sin label formal) */}
            <Input
                label="URL de la Imagen"
                type="url"
                placeholder="Pega la URL aquí..."
                labelHidden // Oculta el label
                inputClass="h-12 text-center italic" // Estilo adicional para el input
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
                    💡 <strong>Tip:</strong> Observa cómo los nuevos props 
                    <code>inputClass</code> y <code>labelHidden</code> te dan 
                    mayor control sobre el estilo y la presentación.
                </p>
            </div>
        </div>
    );
}