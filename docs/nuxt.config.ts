import { defineNuxtConfig } from 'nuxt'
// @ts-ignore
import colors from 'tailwindcss/colors.js'

export default defineNuxtConfig({
  modules: ['vue-plausible'],
  extends: [
    (process.env.DOCUS_THEME_PATH || '@nuxt-themes/docus')
  ],
  ignore: [
    'content/**/*'
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
