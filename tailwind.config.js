/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FBFBF4',
        black: '#18181b',
        blue: '#3a3aff',
        // Alias for semantic usage if needed, though 'warna itu saja' implies simplicity.
        // I will map 'accent' to blue to keep existing code working that might use text-accent
        accent: '#3a3aff',
      },
      fontFamily: {
        heading: ['Migra'],
        body: ['NeueMontreal'],
      },
      gridTemplateColumns: {
        editorial: '1fr 2fr 1fr',
        asymmetric: '2fr 1fr',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '36': '9rem',
        '44': '11rem',
        '60': '15rem',
      },
      screens: {
        sm: '375px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '2xl': '1800px',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1) forwards',
      },
    },
  },
  plugins: [],
}

