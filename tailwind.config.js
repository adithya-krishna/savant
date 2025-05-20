module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Adjust if using pages/
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-poppins-sans)',
        mono: 'var(--font-poppins-mono)',
      },
    },
  },
  plugins: [],
};
