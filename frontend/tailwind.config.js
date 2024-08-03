/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        shopListing:
          '0 4px 6px -1px rgba(253, 175, 123, 0.5), 0 2px 4px -2px rgba(253, 175, 123, 0.6)', // Custom shadow color based on 'soa-peach'
      },
      colors: {
        'soa-purple': '#401F71',
        'soa-mauve': '#824D74',
        'soa-rose': '#BE7B72',
        'soa-peach': '#FDAF7B',
        'soa-white': '#F5F5F5',
        'soa-dark': '#2D2D2D',
        'soa-accent': '#4CAF50',
      },
    },
  },
  plugins: [],
};
