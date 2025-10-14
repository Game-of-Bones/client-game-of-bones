import React from "react";
import clsx from "clsx"; // Asegúrate de tener clsx (npm i clsx)
import "@/styles/button.css"; // Importaremos los estilos específicos aquí

/**
 * Botón Fósil - Componente Reutilizable
 * 
 * Props:
 * - children: contenido del botón
 * - className: para añadir estilos extra
 * - onClick: manejador de eventos
 * - type: "button" | "submit" | "reset"
 */
const Button = ({
  children,
  className,
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx("btn-fosil", className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
