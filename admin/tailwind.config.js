/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        volt: {
          dark: '#1f2937',
          darker: '#111827',
          sidebar: '#1f2937',
          sidebarHover: '#374151',
          primary: '#1f2937',
          secondary: '#fb503b',
          accent: '#10b981',
          light: '#f3f4f6',
        }
      }
    },
  },
  plugins: [],
}
