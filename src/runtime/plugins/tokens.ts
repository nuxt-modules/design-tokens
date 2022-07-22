import type { Ref } from 'vue'
import { kebabCase } from 'scule'
import type { DesignTokensPaths } from '#design-tokens/types'
import { defineNuxtPlugin, unref } from '#imports'

export default defineNuxtPlugin(() => {
  const resolveToken = (path: DesignTokensPaths | Ref<DesignTokensPaths>): string => `var(--${unref(path).split('.').map(key => kebabCase(key)).join('-')})`

  return {
    provide: {
      tokens: resolveToken,
      dt: resolveToken
    }
  }
})
