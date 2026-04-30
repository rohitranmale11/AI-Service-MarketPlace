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
      },
      boxShadow: {
        glow: '0 24px 80px rgba(79, 70, 229, 0.18)',
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 34%), radial-gradient(circle at 85% 15%, rgba(168,85,247,0.14), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, #eef2ff 100%)',
      },
    },
  },
  plugins: [],
};
