/** @type {import('tailwindcss').Config} */


export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#fff1f2",
          "100": "#ffe4e6",
          "200": "#fecdd3",
          "300": "#fda4af",
          "400": "#fb7185",
          "500": "#f43f5e",
          "600": "#e11d48",
          "700": "#be123c",
          "800": "#9f1239",
          "900": "#881337",
          "950": "#4c0519"
        },
        // Dark mode gaming theme colors
        dark: {
          bg: {
            primary: '#0A0E13',
            secondary: '#151922',
            card: '#1A1F2B',
            hover: '#2A3040',
          },
          text: {
            primary: '#FFFFFF',
            secondary: '#B8BDC7',
            muted: '#6B7280',
          },
          accent: {
            primary: '#B4FF39',    // Neon lime green
            secondary: '#7FBF3D',   // Darker lime
            glow: '#D4FF6A',        // Lighter glow
          },
          border: '#2A3040',
        }
      },
      fontFamily: {
        'logo': ['Pacifico'], // Pacifico font for logo
        'body': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        'sans': [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji'
        ],
        'poppins': ['Poppins', 'sans-serif'], // Adding Poppins font,
        'franklin': ['Frank Ruhl Libre', 'sans-serif'] // Adding Franklin Gothic font
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
  variants: {
    extend: {
      placeholderColor: ['dark'], // Enable dark mode for placeholders
    },
  },
}
