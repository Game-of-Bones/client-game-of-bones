import type { Config } from 'tailwindcss'

const config: Config = {
  // Habilitar dark mode con data-theme en el html
  darkMode: ['class', '[data-theme="dark"]'],
  
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  
  theme: {
    extend: {
      // ========================================
      // PALETA DE COLORES - GAME OF BONES
      // Basada en Figma (puede actualizarse)
      // ========================================
      colors: {
        // ===== COLORES PRINCIPALES =====
        primary: {
          50: '#FAF2E5',   // Crema muy claro
          100: '#F5EBC8',  // Beige claro
          200: '#E8D9B8',  // Beige
          300: '#C0B39A',  // Beige oscuro
          400: '#AA7B5C',  // Marrón claro (PRINCIPAL)
          500: '#8B6543',  // Marrón medio
          600: '#6F4E35',  // Marrón oscuro
          700: '#4A3322',  // Marrón chocolate
          800: '#2D1F13',  // Marrón muy oscuro
          900: '#1A110B',  // Casi negro
        },
        
        // ===== COLORES SECUNDARIOS (Verdes/Naturales) =====
        secondary: {
          50: '#E8F4F0',   // Verde muy claro
          100: '#D0E8E1',  // Verde agua claro
          200: '#A8D5C5',  // Verde menta
          300: '#7AB89D',  // Verde claro
          400: '#5A9B7D',  // Verde medio
          500: '#4A8B6A',  // Verde oliva (PRINCIPAL)
          600: '#3A6E54',  // Verde oscuro
          700: '#2A5240',  // Verde profundo
          800: '#1C3829',  // Verde muy oscuro
          900: '#0F1F17',  // Verde casi negro
        },
        
        // ===== ACCENTOS =====
        accent: {
          coral: '#F76C5E',      // Coral para CTAs
          coralDark: '#D9554A',  // Coral oscuro (hover)
          teal: '#6DA49C',       // Azul verdoso
          sage: '#8BA4A6',       // Verde grisáceo
          amber: '#D4A574',      // Ámbar dorado
        },
        
        // ===== SISTEMA DE GRISES =====
        neutral: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        
        // ===== ESTADOS =====
        success: '#4A8B6A',  // Verde
        warning: '#D4A574',  // Ámbar
        error: '#DC2626',    // Rojo
        info: '#6DA49C',     // Teal
      },
      
      // ========================================
      // TIPOGRAFÍA
      // ========================================
      fontFamily: {
        // Font para textos generales
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // Font para títulos y headings
        serif: ['Merriweather', 'Georgia', 'serif'],
        // Font monospace (para código si es necesario)
        mono: ['ui-monospace', 'Menlo', 'Monaco', 'monospace'],
      },
      
      // ========================================
      // BREAKPOINTS RESPONSIVE
      // ========================================
      screens: {
        // Móvil pequeño
        'xs': '375px',
        // Móvil (default)
        'sm': '640px',
        // Tablet
        'md': '768px',
        // Tablet grande / Laptop pequeño
        'lg': '1024px',
        // Laptop
        'xl': '1280px',
        // Desktop
        '2xl': '1536px',
        // Desktop grande
        '3xl': '1920px',
      },
      
      // ========================================
      // ESPACIADO ADICIONAL
      // ========================================
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '100': '25rem',   // 400px
        '112': '28rem',   // 448px
        '128': '32rem',   // 512px
      },
      
      // ========================================
      // ANIMACIONES
      // ========================================
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      // ========================================
      // BORDES Y SOMBRAS
      // ========================================
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'strong': '0 10px 40px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  
  plugins: [],
}

export default config