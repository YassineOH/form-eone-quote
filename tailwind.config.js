/** @type {import('tailwindcss').Config} */
import prettierPlugin from '@tailwindcss/forms'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    extend: {
      colors: {
        primary: '#00b8ad'
      },
    },
  },
  plugins: [
    prettierPlugin
  ],
}

