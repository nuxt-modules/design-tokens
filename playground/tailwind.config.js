import { $dt } from '../src/index'

export default {
  theme: {
    extend: {
      colors: {
        primary: $dt('colors.primary'),

        black: {
          DEFAULT: $dt('colors.black')
        },

        grape: {
          DEFAULT: $dt('colors.grape')
        },

        lila: {
          DEFAULT: $dt('colors.lila')
        },

        grey: {
          DEFAULT: $dt('colors.grey')
        },

        lavender: {
          DEFAULT: $dt('colors.lavender')
        }
      }
    }
  }
}
