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
  }
})
