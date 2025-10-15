import React from 'react';

/**
 * Componente de carga básico (Spinner).
 * Se muestra mientras se está esperando una respuesta asíncrona.
 * Usa variables CSS del tema en lugar de clases hardcodeadas
 */
const Spinner: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col justify-center items-center py-8">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4"
        style={{ 
          borderTopColor: 'var(--color-amber)',
          borderBottomColor: 'var(--color-amber)'
        }}
        aria-label={message}
      ></div>
      {message && (
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;