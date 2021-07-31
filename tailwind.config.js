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
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        light: {
          'primary' : '#A78BFA',           /* Primary color */
          'primary-focus' : '#8B5CF6',     /* Primary color - focused */
          'primary-content' : '#ffffff',   /* Foreground content color to use on primary color */

          'secondary' : '#FCA5A5',         /* Secondary color */
          'secondary-focus' : '#F87171',   /* Secondary color - focused */
          'secondary-content' : '#ffffff', /* Foreground content color to use on secondary color */

          'accent' : '#6EE7B7',            /* Accent color */
          'accent-focus' : '#34D399',      /* Accent color - focused */
          'accent-content' : '#ffffff',    /* Foreground content color to use on accent color */

          'neutral' : '#3d4451',           /* Neutral color */
          'neutral-focus' : '#2a2e37',     /* Neutral color - focused */
          'neutral-content' : '#ffffff',   /* Foreground content color to use on neutral color */

          'base-100' : '#ffffff',          /* Base color of page, used for blank backgrounds */
          'base-200' : '#f9fafb',          /* Base color, a little darker */
          'base-300' : '#d1d5db',          /* Base color, even more darker */
          'base-content' : '#1f2937',      /* Foreground content color to use on base color */

          'info' : '#3B82F6',              /* Info */
          'success' : '#059669',           /* Success */
          'warning' : '#F59E0B',           /* Warning */
          'error' : '#EF4444',             /* Error */
        },
        dark: {
          'primary' : '#1b2d48',           /* Primary color */
          'primary-focus' : '#2c456b',     /* Primary color - focused */
          'primary-content' : '#eeeeee',   /* Foreground content color to use on primary color */

          'secondary' : '#7F1D1D',         /* Secondary color */
          'secondary-focus' : '#991B1B',   /* Secondary color - focused */
          'secondary-content' : '#eeeeee', /* Foreground content color to use on secondary color */

          'accent' : '#064E3B',            /* Accent color */
          'accent-focus' : '#065F46',      /* Accent color - focused */
          'accent-content' : '#eeeeee',    /* Foreground content color to use on accent color */

          'neutral' : '#171626',           /* Neutral color */
          'neutral-focus' : '#2a2e37',     /* Neutral color - focused */
          'neutral-content' : '#eeeeee',   /* Foreground content color to use on neutral color */

          'base-100' : '#171626',          /* Base color of page, used for blank backgrounds */
          'base-200' : '#130f20',          /* Base color, a little darker */
          'base-300' : '#0a0813',          /* Base color, even more darker */
          'base-content' : '#eeeeee',      /* Foreground content color to use on base color */

          'info' : '#93C5FD',              /* Info */
          'success' : '#064E3B',           /* Success */
          'warning' : '#D97706',           /* Warning */
          'error' : '#831843',             /* Error */
        }
      }
    ]
  }
}
