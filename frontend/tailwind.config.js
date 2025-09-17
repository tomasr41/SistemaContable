/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        parpadeo: {
          '0%, 100%': { backgroundColor: '#1f2937' }, // bg-gray-800
          '50%': { backgroundColor: '#fbbf24' },      // bg-yellow-400
        },
      },
      animation: {
        parpadeando: 'parpadeo 4s infinite',
      },
    },
  },
  plugins: [],
};

