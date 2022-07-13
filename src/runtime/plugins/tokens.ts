import type { Ref } from 'vue'
import { kebabCase } from 'scule'
import type { DesignTokensPaths } from '#tokens/types'
import { defineNuxtPlugin, unref } from '#imports'

export default defineNuxtPlugin(() => {
  const resolveToken = (path: DesignTokensPaths | Ref<TokensPaths>): string => `var(--${unref(path).split('.').map(key => kebabCase(key)).join('-')})`

  return {
    provide: {
      tokens: resolveToken,
      t: resolveToken
    }
  }
})
