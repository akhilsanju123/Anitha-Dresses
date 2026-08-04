import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FDF2F4',
          100: '#FCE4E8',
          200: '#F9C9D1',
          300: '#F49FA0',
          400: '#EB6873',
          500: '#DD3B4B',
          600: '#C02234',
          700: '#9E1827',
          800: '#801522',
          900: '#4A0E17',
          950: '#3A0810',
        },
        gold: {
          50: '#FCFBF4',
          100: '#F8F4E0',
          200: '#EFE3B5',
          300: '#E4CF85',
          400: '#DAB855',
          500: '#D4AF37',
          600: '#B58E29',
          700: '#916B20',
          800: '#755420',
          900: '#62451E',
          950: '#39240E',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#FAF6F0',
          300: '#F4ECE0',
          400: '#EAE0D0',
        },
        charcoal: {
          800: '#27272A',
          900: '#18181B',
          950: '#0F0F10',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
        telugu: ['Gidugu', 'Ramabhadra', 'Noto Serif Telugu', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #5C0D1B 0%, #3A0810 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(74, 14, 23, 0.15)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
};
export default config;
