import React from 'react';
import { Info, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Propiedades del componente Alert
 * @param type Define el color y el ícono ('success', 'error', 'warning', 'info')
 * @param message El mensaje de texto principal a mostrar
 */
interface AlertProps {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

const baseStyles = "p-4 rounded-lg flex items-start text-sm font-medium border-l-4";

const typeStyles = {
    info: {
        container: "bg-blue-50 border-blue-500 text-blue-700",
        icon: <Info size={20} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />,
    },
    error: {
        container: "bg-red-50 border-red-500 text-red-700",
        icon: <XCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />,
    },
    success: {
        container: "bg-green-50 border-green-500 text-green-700",
        icon: <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />,
    },
    warning: {
        container: "bg-yellow-50 border-yellow-500 text-yellow-700",
        icon: <AlertTriangle size={20} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />,
    },
};

const Alert: React.FC<AlertProps> = ({ type, message }) => {
    const styles = typeStyles[type] || typeStyles.info;

    return (
        <div 
            role="alert" 
            className={`${baseStyles} ${styles.container}`}
            // Aplicamos estilos custom si tienes un tema específico, si no, usa el de Tailwind por defecto
            style={{ 
                // Ejemplo para adaptarlo a tu tema si es oscuro:
                // Si type === 'error', el color de fondo sería más oscuro, y el texto claro.
                // Lo mantendremos con estilos claros para buena visibilidad por defecto.
            }}
        >
            {styles.icon}
            <div>
                {message}
            </div>
        </div>
    );
};

export default Alert;