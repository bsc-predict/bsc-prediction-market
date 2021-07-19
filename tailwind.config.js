const colors = require('tailwindcss/colors')

module.exports = {
  mode: "jit",
  purge: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  darkMode: 'class',
  theme: {
    colors: {
      white: colors.white,
      gray: colors.coolGray,
      green: colors.green,
      blue: colors.sky,
      red: colors.rose,
      pink: colors.fuchsia,
      black: colors.black,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    resize: true
  },
  plugins: [],
}
