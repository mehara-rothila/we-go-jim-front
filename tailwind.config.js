// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-darker': '#0f172a',
        'light-bg': '#f9fafb',
        'light-card': '#ffffff',
        'light-border': '#e5e7eb',
        'dark-border': '#2a334a',
        'text-light': '#ffffff',
        'text-muted': '#94a3b8',
        'text-link': '#3b82f6',
      }
    },
  },
  plugins: [],
}