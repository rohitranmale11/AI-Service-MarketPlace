/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: '#111827',
        mist: '#F8FAFC',
        primary: '#2563EB',
        secondary: '#0F172A',
        accent: '#22C55E',
      },
      boxShadow: {
        glow: '0 18px 45px rgba(37, 99, 235, 0.18)',
        soft: '0 12px 28px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        mesh: 'linear-gradient(180deg, #ffffff 0%, #F8FAFC 48%, #EFF6FF 100%)',
      },
    },
  },
  plugins: [],
};
