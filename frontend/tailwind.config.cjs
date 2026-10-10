/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#7b8fad',
          500: '#627d98',
          600: '#334e68',
          700: '#243b53',
          800: '#1a2e44',
          900: '#102a43',
          950: '#0a1929',
        },
        saffron: '#FF9933',
        trigreen: '#138808',
      },
      fontFamily: {
        sans: ['Noto Sans', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradientX 6s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59,130,246,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(59,130,246,0.5)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundSize: {
        '300%': '300% 300%',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(16,42,67,0.1), 0 2px 8px -2px rgba(16,42,67,0.06)',
        'premium-lg': '0 10px 40px -10px rgba(16,42,67,0.15), 0 4px 16px -4px rgba(16,42,67,0.08)',
        'premium-xl': '0 20px 60px -15px rgba(16,42,67,0.2), 0 8px 24px -6px rgba(16,42,67,0.1)',
        'inner-glow': 'inset 0 1px 2px rgba(255,255,255,0.1)',
        'blue-glow': '0 0 20px rgba(59,130,246,0.3)',
        'card': '0 1px 3px rgba(16,42,67,0.06), 0 1px 2px rgba(16,42,67,0.04)',
        'card-hover': '0 10px 30px -8px rgba(16,42,67,0.12), 0 4px 12px -4px rgba(16,42,67,0.06)',
      },
    },
  },
  plugins: [],
}
