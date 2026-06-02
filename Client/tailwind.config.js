export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        label: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#151210',
          card: '#221C18',
        },
        'panchayat-primary': '#6B4F3A',
        'panchayat-accent': '#C8A45D',
        'panchayat-text': '#F5F1EA',
        'panchayat-muted': '#B8AEA3',
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(46, 125, 50, 0.4)',
        'glow-sm': '0 0 40px -8px rgba(46, 125, 50, 0.3)',
        'glow-gold': '0 0 60px -12px rgba(200, 155, 60, 0.3)',
        card: '0 1px 0 0 rgba(15, 23, 42, 0.04), 0 24px 48px -24px rgba(15, 23, 42, 0.12)',
        'card-dark': '0 1px 0 0 rgba(255, 255, 255, 0.06), 0 24px 48px -24px rgba(0, 0, 0, 0.45)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
    },
  },
  plugins: [],
}
