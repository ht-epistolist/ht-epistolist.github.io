/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        venusta: {
          silver: '#e2e8f0',
          pearl: '#cbd5e1',
          charcoal: '#080d0a',
        },
        accent: {
          green: {
            DEFAULT: '#059669', // Leucauge venusta metallic orchard emerald
            light: '#10b981',
            dark: '#047857'
          },
          orange: {
            DEFAULT: '#ea580c', // Leucauge venusta fiery ventral flame orange
            light: '#f97316',
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
