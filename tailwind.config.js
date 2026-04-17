/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF6E6C',
        'primary-light': '#FFE1D9',
        accent: '#67568C',
        'dark-bg': '#121216',
        'card-dark': '#1E1E24',
      },
      fontFamily: {
        // Font configuration for React Native (Requires linking fonts)
        heading: ['CormorantGaramond-Bold'],
        display: ['DMSerifDisplay-Regular'],
        body: ['PlusJakartaSans-Regular'],
        mono: ['JetBrainsMono-Regular'],
      },
    },
  },
  plugins: [],
}
