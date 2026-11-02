/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './app/**/*.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      maxWidth: {
        'site': '1600px',
        '1600': '1600px'
      },
      colors: {
        'ystore-yellow': {
          100: '#FEFEEB',
          200: '#FCFBD5',
          300: '#F9F7BA',
          400: '#F6F295',
          500: '#F4EB6A',
          600: '#EDE258',
          700: '#E5D744',
          800: '#DDCA32',
          900: '#D4BB23',
          1000: '#CCA917',
          DEFAULT: '#F4EB6A'
        },
        'ystore-brown': {
          100: '#F0EEEB',
          200: '#E2E0D8',
          300: '#CCC9BD',
          400: '#B5B19F',
          500: '#9D977F',
          600: '#857D61',
          700: '#706747',
          800: '#60583C',
          900: '#514A32',
          1000: '#423C27',
          DEFAULT: '#706747'
        },
        primary: {
          100: '#FEFEEB',
          200: '#FCFBD5',
          300: '#F9F7BA',
          400: '#F6F295',
          500: '#F4EB6A',
          600: '#EDE258',
          700: '#E5D744',
          800: '#DDCA32',
          900: '#D4BB23',
          1000: '#CCA917',
          DEFAULT: '#F4EB6A'
        },
        secondary: {
          100: '#F0EEEB',
          200: '#E2E0D8',
          300: '#CCC9BD',
          400: '#B5B19F',
          500: '#9D977F',
          600: '#857D61',
          700: '#706747',
          800: '#60583C',
          900: '#514A32',
          1000: '#423C27',
          DEFAULT: '#706747'
        },
        dark: {
          900: '#151515',
          800: '#1E1E1E',
          700: '#2A2A2A',
          600: '#3D3D3D'
        }
      },
      fontSize: {
        'desktop-heading': ['40px', { lineHeight: '1.2', fontWeight: '500' }],
        'mobile-heading': ['32px', { lineHeight: '1.25', fontWeight: '500' }],
        'subheading': ['24px', { lineHeight: '1.35', fontWeight: '400' }],
        'body-custom': ['16px', { lineHeight: '1.6', fontWeight: '400' }]
      }
    }
  },
  plugins: []
}
