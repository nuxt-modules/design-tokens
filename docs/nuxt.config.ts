import { defineNuxtConfig } from 'nuxt'
// @ts-ignore
import colors from 'tailwindcss/colors.js'

export default defineNuxtConfig({
  extends: [
    (process.env.DOCUS_THEME_PATH || '@nuxt-themes/docus')
  ],
  components: [
    {
      path: '~/components',
      prefix: '',
      global: true
    }
  ],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: colors.pink
          }
        }
      }
    }
  },
  colorMode: {
    preference: 'dark'
  }
})
