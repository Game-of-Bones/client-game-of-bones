import { type ButtonHTMLAttributes, type ReactNode } from "react";

/**
 * Botón Fósil - Componente Reutilizable
 * 
 * Estilo temático de Game of Bones con efecto de relieve y sombras
 * Compatible con modo claro y oscuro
 * 
 * @example
 * <Button onClick={handleClick}>Explorar Fósiles</Button>
 * <Button type="submit" disabled>Cargando...</Button>
 * <Button className="w-full">Botón ancho</Button>
 */

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Contenido del botón (texto, iconos, etc.) */
  children: ReactNode;
  /** Clases adicionales de Tailwind para personalización */
  className?: string;
  /** Manejador de eventos al hacer clic */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Tipo de botón HTML */
  type?: "button" | "submit" | "reset";
  /** Variante del botón */
  variant?: "primary" | "secondary" | "danger";
}

const Button = ({
  children,
  className = "",
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) => {
  
  // Estilos base compartidos
  const baseStyles = `
    inline-flex items-center justify-center
    font-semibold text-xl
    px-8 py-4
    rounded-xl
    border-2
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:hover:scale-100
  `;

  // Estilos según variante
  const variantStyles = {
    primary: `
      text-white
      bg-gradient-to-b from-[rgba(70,46,27,0.95)] to-[rgba(80,55,35,0.95)]
      border-[rgba(139,107,77,0.8)]
      shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_-2px_4px_rgba(0,0,0,0.1)]
      hover:scale-105
      hover:shadow-[0_6px_12px_rgba(139,107,77,0.6),inset_0_-2px_4px_rgba(0,0,0,0.15)]
      hover:bg-gradient-to-b hover:from-[rgba(80,55,35,1)] hover:to-[rgba(90,65,45,1)]
      active:scale-95
    `,
    secondary: `
      text-[#462e1b]
      bg-gradient-to-b from-[#F5E6CC] to-[#E8D9B8]
      border-[#C0B39A]
      shadow-[0_4px_8px_rgba(0,0,0,0.15)]
      hover:scale-105
      hover:shadow-[0_6px_12px_rgba(192,179,154,0.5)]
      hover:bg-gradient-to-b hover:from-[#E8D9B8] hover:to-[#C0B39A]
      active:scale-95
    `,
    danger: `
      text-white
      bg-gradient-to-b from-[#dc2626] to-[#b91c1c]
      border-[#991b1b]
      shadow-[0_4px_8px_rgba(0,0,0,0.2)]
      hover:scale-105
      hover:shadow-[0_6px_12px_rgba(220,38,38,0.5)]
      hover:bg-gradient-to-b hover:from-[#b91c1c] hover:to-[#991b1b]
      active:scale-95
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
      style={{ fontFamily: "'Cinzel', serif" }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

/**
 * VARIANTES DEL COMPONENTE
 */

/** Botón primario - estilo fósil principal */
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
);

/** Botón secundario - estilo claro */
export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="secondary" {...props} />
);

/** Botón de peligro - para acciones destructivas */
export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="danger" {...props} />
);