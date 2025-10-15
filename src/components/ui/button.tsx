import { type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import "@/styles/button.css";

/**
 * Botón Fósil - Componente Reutilizable
 * 
 * Props:
 * - children: contenido del botón
 * - className: para añadir estilos extra
 * - onClick: manejador de eventos
 * - type: "button" | "submit" | "reset"
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  children,
  className,
  onClick,
  type = "button",
  ...props
}: ButtonProps) => {
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