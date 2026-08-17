/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* === Page Backgrounds === */
        bg: {
          DEFAULT: '#FAF9F6',
          alt: '#F8F7F3',
          dark: '#0C0D0E',
        },
        /* === Surfaces === */
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#FCFBF9',
          dark: '#161719',
        },
        /* === Cards === */
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#1F2023',
        },
        /* === Ink / Text === */
        ink: {
          DEFAULT: '#111111',
          secondary: '#404040',
          muted: '#6B6B6B',
          light: '#909090',
          dark: '#FFFFFF',
          'dark-secondary': '#A1A1A1',
        },
        /* === Pastel Accents === */
        pastel: {
          blue: '#DCEAFF',
          'blue-dark': '#D8E8FC',
          mint: '#D4F2E3',
          'mint-dark': '#CDEEDC',
          yellow: '#FFF0C9',
          'yellow-dark': '#FDE8B3',
          pink: '#FCE5E6',
          purple: '#E9DDF8',
        },
        /* === Borders === */
        border: {
          DEFAULT: '#E8E5DF',
          dark: 'rgba(255,255,255,0.1)',
        },
        /* === Legacy compatibility (used in existing Button/Card/etc CVA classes) === */
        primary: {
          DEFAULT: '#111111',
          foreground: '#ffffff',
          50: '#F5F5F5',
          100: '#E8E8E8',
          500: '#111111',
          600: '#0A0A0A',
          700: '#050505',
          900: '#000000',
        },
        secondary: {
          DEFAULT: '#404040',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#10B981',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#10B981',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#EF4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#F8F7F3',
          foreground: '#6B6B6B',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#111111',
        },
        /* === Legacy brand colors (soft-mapped) === */
        'brand-blue': '#111111',
        'brand-dark': '#111111',
        'brand-accent': '#10B981',
        'brand-purple': '#404040',
      },
      borderRadius: {
        sm: '10px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '40px',
        pill: '9999px',
      },
      fontFamily: {
        serif: ['"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
        logo: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        accent: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '400' }],
        'hero-sm': ['clamp(2.25rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display': ['clamp(2rem, 3.5vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '500' }],
        'heading': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'subheading': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'container': '1320px',
        'narrow': '768px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card': '0 8px 30px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)',
        'lift': '0 20px 60px rgba(0,0,0,0.08), 0 6px 12px rgba(0,0,0,0.04)',
        'nav': '0 4px 20px rgba(0,0,0,0.06)',
        'dark-soft': '0 4px 20px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 600ms ease-out forwards',
        'slide-up': 'slideUp 600ms ease-out forwards',
        'slide-down': 'slideDown 400ms ease-out',
        'scale-in': 'scaleIn 400ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, #D5D3CE 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-sm': '24px 24px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}