/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          green: {
            DEFAULT: '#059669',
            dark: '#047857'
          },
          orange: {
            DEFAULT: '#ea580c',
            dark: '#c2410c'
          }
        }
      },
      fontFamily: {
        heading: ['"Work Sans"', 'sans-serif'],
        body: ['"Lora"', 'serif'],
      }
    },
  },
  plugins: [],
}
