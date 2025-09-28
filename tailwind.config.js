/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-plex': ['"IBM Plex Mono"', 'monospace'],
        'yipes': ['"Yipes Regular"', 'sans-serif'],
        'pixelify': ['"Pixelify Sans"', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-down': 'slideDown 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-out': 'fadeOut 0.6s ease-in-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateX(-50%) translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateX(-50%) translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateX(-50%) translateY(0)', opacity: '1' },
          '100%': { transform: 'translateX(-50%) translateY(100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      colors: {
        'gold': '#e1bc49',
      },
    },
  },
  plugins: [],
}