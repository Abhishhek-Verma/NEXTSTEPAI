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
        /* === Website Background: #F9F8F6 === */
        bg: {
          DEFAULT: '#F9F8F6',
          alt: '#EFE9E3',
          dark: '#1C1B1A',
        },
        /* === Secondary Theme Surface: #EFE9E3 === */
        surface: {
          DEFAULT: '#EFE9E3',
          secondary: '#F9F8F6',
          dark: '#262422',
        },
        /* === Cards === */
        card: {
          DEFAULT: '#EFE9E3',
          dark: '#262422',
        },
        /* === Text: Black (#000000) === */
        ink: {
          DEFAULT: '#000000',
          secondary: '#333333',
          muted: '#555555',
          light: '#777777',
          dark: '#F9F8F6',
          'dark-secondary': '#D9CFC7',
        },
        /* === Supporting / Pastel Palette === */
        pastel: {
          blue: '#F9F8F6',
          'blue-dark': '#EFE9E3',
          mint: '#EFE9E3',
          'mint-dark': '#D9CFC7',
          yellow: '#C9B59C',
          'yellow-dark': '#B8A388',
          pink: '#D9CFC7',
          purple: '#EFE9E3',
        },
        /* === Tertiary Theme Border/Dividers: #D9CFC7 === */
        border: {
          DEFAULT: '#D9CFC7',
          dark: 'rgba(217, 207, 199, 0.2)',
        },
        /* === Button / Main Accent Color: #C9B59C === */
        primary: {
          DEFAULT: '#C9B59C',
          foreground: '#000000',
          50: '#F9F8F6',
          100: '#EFE9E3',
          500: '#C9B59C',
          600: '#B8A388',
          700: '#A49076',
          900: '#756550',
        },
        secondary: {
          DEFAULT: '#EFE9E3',
          foreground: '#000000',
        },
        tertiary: {
          DEFAULT: '#D9CFC7',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#C9B59C',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#C9B59C',
          foreground: '#000000',
        },
        success: {
          DEFAULT: '#C9B59C',
          foreground: '#000000',
        },
        warning: {
          DEFAULT: '#C9B59C',
          foreground: '#000000',
        },
        error: {
          DEFAULT: '#C9B59C',
          foreground: '#000000',
        },
        muted: {
          DEFAULT: '#EFE9E3',
          foreground: '#000000',
        },
        popover: {
          DEFAULT: '#EFE9E3',
          foreground: '#000000',
        },
        /* === Legacy brand tokens mapped to new palette === */
        'brand-blue': '#C9B59C',
        'brand-dark': '#000000',
        'brand-accent': '#C9B59C',
        'brand-purple': '#D9CFC7',
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
        'dot-pattern': 'radial-gradient(circle, #D9CFC7 1px, transparent 1px)',
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