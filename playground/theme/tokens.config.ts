import { defineTokens, palette, compose } from '../../src'

export default defineTokens({
  colors: {
    primary: palette('rgb(49, 52, 66)'),
    black: {
      value: '#1C1D21'
    },
    grape: {
      value: '#A288A6'
    },
    lila: {
      value: '#BB9BB0'
    },
    grey: {
      value: '#CCBCBC'
    },
    lavender: {
      value: '#F1E3E4'
    },
    velvet: {
      value: '#502274'
    }
  },

  screens: {
    sm: { value: '640px' },
    md: { value: '768px' },
    lg: { value: '1024px' },
    xl: { value: '1280px' },
    '2xl': { value: '1536px' }
  },

  components: {
    block: compose({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px',
      width: '320px',
      height: '320px',
      border: '4px solid {colors.black}',
      ':hover': {
        border: '4px solid {colors.velvet}'
      },
      variants: {
        primary: {
          backgroundColor: '{colors.primary.500}'
        },
        black: {
          backgroundColor: '{colors.black}'
        },
        lavender: {
          backgroundColor: '{colors.lavender}'
        },
        lila: {
          backgroundColor: '{colors.lila}'
        },
        velvet: {
          backgroundColor: '{colors.velvet}'
        },
        grape: {
          backgroundColor: '{colors.grape}'
        },
        rounded: {
          borderRadius: '50%'
        },
        padded: {
          padding: '4rem'
        }
      }
    })
  }
})
