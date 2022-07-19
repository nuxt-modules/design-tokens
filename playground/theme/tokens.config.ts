import { defineTokens, palette } from '../../src'

const primary = palette('blue')

export default defineTokens({
  colors: {
    primary,

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
  }
})
