import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#40E0D0', // Turquoise
        secondary: '#FFC107', // Yellow
        background: '#ffffff',
        foreground: '#000000',
      },
      fontFamily: {
        thai: ['"Noto Sans Thai"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
